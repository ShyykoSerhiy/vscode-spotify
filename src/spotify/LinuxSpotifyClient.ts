import { SpotifyClient, createCancelablePromise }   from './SpotifyClient';
import { Spotilocal }                               from 'spotilocal';
import { Status }                                   from 'spotilocal/src/status';
import { SpotifyStatusController }                  from '../SpotifyStatusController';
import { SpotifyStatusState }                       from '../SpotifyStatus';
import { showInformationMessage }                   from '../info/Info';
import { getShowInitializationError }               from '../config/SpotifyConfig'
import { exec }                                     from 'child_process'; 

const PlayNextTrackDebianCmd        = 'dbus-send  --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.Next'
const PlayPreviousTrackDebianCmd    = 'dbus-send  --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.Previous'

let terminalCommand = (cmd: string) => {
    /**
     * This is a wrapper for executing terminal commands
     * by using NodeJs' built in "child process" library.
     * This function initially returns a Promise.
     * 
     * @param {string} cmd This is the command to execute
     * @return {string} the standard output of the executed command on successful execution
     * @return {boolean} returns false if the executed command is unsuccessful
     * 
     */
    return new Promise((resolve, reject) => {
        exec(cmd, (e,stdout,stderr) => {
            if (e)      { return resolve(false); }
            if (stderr) { return resolve(false); }
            resolve(stdout);
        });
    });
};

function returnIfNotInitialized(_ignoredTarget: any, _ignoredPropertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const fn = descriptor.value as Function;

    if (typeof fn !== 'function') {
        throw new Error(`@returnIfNotInitialized can only be applied to method and not to ${typeof fn}`)
    }

    return Object.assign({}, descriptor, {
        value: function () {
            if (!this.initialized && getShowInitializationError()) {
                showInformationMessage('Failed to initialize vscode-spotify. We\'ll keep trying every 20 seconds.');
                return;
            }
            return fn.apply(this, arguments);
        }
    })
}

function notSupported(_ignoredTarget: any, _ignoredPropertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const fn = descriptor.value as Function;

    if (typeof fn !== 'function') {
        throw new Error(`@notSupported can only be applied to method and not to ${typeof fn}`)
    }

    return Object.assign({}, descriptor, {
        value: function () {
            showInformationMessage('This functionality is not supported on this platform.');
            return;
        }
    })
}

function convertSpotilocalStatus(spotilocalStatus: Status): SpotifyStatusState {
    return {
        isRunning: true,
        state: {
            volume: spotilocalStatus.volume,
            position: spotilocalStatus.playing_position,
            state: spotilocalStatus.playing ? 'playing' : 'paused'
        },
        track: {
            album: spotilocalStatus.track.album_resource.name,
            artist: spotilocalStatus.track.artist_resource.name,
            name: spotilocalStatus.track.track_resource.name
        },
        isRepeating: spotilocalStatus.repeat,
        isShuffling: spotilocalStatus.shuffle
    };
}

const EMPTY_FN = () => { };

export class LinuxSpotifyClient implements SpotifyClient {
    private spotifyStatusController: SpotifyStatusController;
    private spotilocal: Spotilocal;
    private initialized: boolean;
    private showedReinitMessage: boolean;
    private initTimeoutId: number;
    private currentOnVolume: string;

    constructor(spotifyStatusController: SpotifyStatusController) {
        this.spotifyStatusController = spotifyStatusController;
        this.spotilocal = new Spotilocal();
        this.currentOnVolume = "0" // Used to capture what the volume is as a string when volume is not zero.

        this.retryInit();
    }
    private retryInit() {
        this.initialized = false;
        this.initTimeoutId && clearTimeout(this.initTimeoutId);
        const lastUsedPort = this.spotifyStatusController.globalState.get<number>("lastUsedPort");
        this.spotilocal.init(lastUsedPort).then(() => {
            this.initialized = true;
            this.showedReinitMessage = false;

            this.spotifyStatusController.globalState.update("lastUsedPort", this.spotilocal.port);
        }).catch((ignorredError) => {
            if (!this.showedReinitMessage && getShowInitializationError()) {
                showInformationMessage('Failed to initialize vscode-spotify. We\'ll keep trying every 20 seconds.');
            }
            console.error('Failed to initialize vscode-spotify. We\'ll keep trying every 20 seconds.', ignorredError);
            this.showedReinitMessage = true;
            this.initTimeoutId = setTimeout(this.retryInit.bind(this), 20 * 1000);
        });
    }

    next() { 
        terminalCommand(PlayNextTrackDebianCmd) 
    }

    previous() {
        terminalCommand(PlayPreviousTrackDebianCmd)
    }

    @returnIfNotInitialized
    play() {
        this.spotilocal.pause(false).catch((error) => {
            showInformationMessage(`Failed to play. We are going to retry reinit spotilocal. ${error}`);
            this.retryInit.bind(this);
        });
    }
    @returnIfNotInitialized
    pause() {
        this.spotilocal.pause(true).catch((error) => {
            showInformationMessage(`Failed to pause. We are going to retry reinit spotilocal. ${error}`);
            this.retryInit.bind(this);
        });
    }
    @returnIfNotInitialized
    playPause() {
        this.spotilocal.getStatus().then((status) => {
            if (status.playing) {
                this.pause();
            } else {
                this.play();
            }
        }).catch((error) => {
            showInformationMessage(`Failed to playPause. We are going to retry reinit spotilocal. ${error}`);
            this.retryInit.bind(this)
        });;
    }
    pollStatus(cb: (status: SpotifyStatusState) => void) {
        if (!this.initialized) {
            return { promise: Promise.reject<void>('Failed to initiate status polling. spotilocal is not initialized'), cancel: EMPTY_FN };
        }

        let canceled = false;
        const p = createCancelablePromise<void>((_resolve, reject) => {
            this.spotilocal.getStatus().then(status => {
                cb(convertSpotilocalStatus(status));
                const _poll = () => {
                    if (canceled) {
                        return;
                    }
                    this.spotilocal.getStatus(['play', 'pause'], 0).then(status => {
                        cb(convertSpotilocalStatus(status));
                        _poll();
                    }).catch(reject);
                };
                _poll();
            }).catch(reject);
        });
        p.promise = p.promise.catch((err) => {
            if (err && err.code === 'ECONNREFUSED'){
                this.retryInit();
            }

            canceled = true;
            throw err;
        });
        return p;
    }
    
    findSpotify(s: string) {
        /**
         *  This function checks to see which "Sinked Input #"
         *  is actually running spotify.
         * 
         *  @param {string} s The sting that might be contain the Sinked Input #
         *  we are looking for.
         *  @return {boolean} This function was intended to be used with map in order
         *  to remap an Array where there should only be one element after we "findSpotify"
         */
        let foundSpotifySink = s.match(/(Spotify)/i)
        return (foundSpotifySink != null)? ((foundSpotifySink.length > 1)? true : false) : false
    }

    muteVolume() {
        terminalCommand('pactl list sink-inputs')
            .then((d: string) => {
                let sinkedArr = d.split('Sinked Input #')
                return (sinkedArr != null)? sinkedArr.filter(this.findSpotify) : []
            })
            .then((a: string[]) => {
                if (a.length > 0) {
                    let currentVol = a[0].match(/(\d{1,3})%/i);
                    if (currentVol != null) {
                        let sinkNum = a[0].match(/Sink Input #(\d{1,3})/);
                        if (currentVol.length > 1) {
                            if (parseInt(currentVol[1]) > 0 && sinkNum != null) {
                                this.currentOnVolume = currentVol[1];
                                terminalCommand('pactl set-sink-input-volume ' + sinkNum[1] + ' 0%')
                            }
                        }
                    }
                }
            })
        .catch(e => console.log(e))
    }
   
    unmuteVolume() {
        terminalCommand('pactl list sink-inputs')
            .then((d: string) => {
                let sinkedArr = d.split('Sinked Input #')
                return (sinkedArr != null)? sinkedArr.filter(this.findSpotify) : []
            })
            .then((a: string[]) => {
                if (a.length > 0) {
                    let currentVol = a[0].match(/(\d{1,3})%/i);
                    console.log("CURRENTVOL:", currentVol)
                    if (currentVol != null) {
                        let sinkNum = a[0].match(/Sink Input #(\d{1,3})/);
                        console.log("ARRAY:", a)
                        console.log("SINKEDINPUTS:", sinkNum)
                        if (currentVol.length > 1) {
                            if(parseInt(currentVol[1]) === 0 && sinkNum != null)
                                terminalCommand('pactl set-sink-input-volume ' + sinkNum[1] + ' ' + this.currentOnVolume + '%')
                        }   
                    }
                }
            })
        .catch(e => console.log(e))
    }

    muteUnmuteVolume() {
        terminalCommand('pactl list sink-inputs')
            .then((d: string) => {
                let sinkedArr = d.split('Sinked Input #')
                return (sinkedArr != null)? sinkedArr.filter(this.findSpotify) : []
            })
            .then((a: string[]) => {
                if (a.length > 0) {
                    let currentVol = a[0].match(/(\d{1,3})%/i);
                    console.log("CURRENTVOL:", currentVol)
                    if (currentVol != null) {
                        let sinkNum = a[0].match(/Sink Input #(\d{1,3})/);
                        console.log("ARRAY:", a)
                        console.log("SINKEDINPUTS:", sinkNum)
                        if (currentVol.length > 1) {
                            if (parseInt(currentVol[1]) > 0 && sinkNum != null) {
                                this.currentOnVolume = currentVol[1];
                                terminalCommand('pactl set-sink-input-volume ' + sinkNum[1] + ' 0%')
                            }
                            else if(parseInt(currentVol[1]) === 0 && sinkNum != null) {
                                terminalCommand('pactl set-sink-input-volume ' + sinkNum[1] + ' ' + this.currentOnVolume + '%')
                            }
                        }   
                    }
                }
            })
        .catch(e => console.log(e))
    }
    
    volumeUp() {
        terminalCommand('pactl list sink-inputs')
            .then((d: string) => {
                let sinkedArr = d.split('Sinked Input #')
                return (sinkedArr != null)? sinkedArr.filter(this.findSpotify) : []
            })
            .then((a: string[]) => {
                if (a.length > 0) {
                    let sinkNum = a[0].match(/Sink Input #(\d{1,3})/);
                    if (sinkNum != null) {
                        terminalCommand('pactl set-sink-input-volume ' + sinkNum[1] + ' +5%')
                    }
                }
            })
        .catch(e => console.log(e))
    }

    volumeDown() {
        terminalCommand('pactl list sink-inputs')
            .then((d: string) => {
                let sinkedArr = d.split('Sinked Input #')
                return (sinkedArr != null)? sinkedArr.filter(this.findSpotify) : []
            })
            .then((a: string[]) => {
                if (a.length > 0) {
                    let sinkNum = a[0].match(/Sink Input #(\d{1,3})/);
                    if (sinkNum != null) {
                        terminalCommand('pactl set-sink-input-volume ' + sinkNum[1] + ' -5%')
                    }
                }
            })
        .catch(e => console.log(e))
    }
    @notSupported
    toggleRepeating() {
    }
    @notSupported
    toggleShuffling() {
    }
}
