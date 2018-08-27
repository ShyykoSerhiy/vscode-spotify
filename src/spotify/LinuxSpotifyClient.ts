import { SpotifyClient, createCancelablePromise } from './SpotifyClient';
import { SpotifyStatusController } from '../SpotifyStatusController';
import { exec } from 'child_process';
import { OsAgnosticSpotifyClient } from './OsAgnosticSpotifyClient';
import { SpotifyStatusState } from '../SpotifyStatus';

const SP_DEST = "org.mpris.MediaPlayer2.spotify"
const SP_PATH = "/org/mpris/MediaPlayer2"
const SP_MEMB = "org.mpris.MediaPlayer2.Player"
const DB_P_GET = "org.freedesktop.DBus.Properties.Get";
const PlayNextTrackDebianCmd = `dbus-send  --print-reply --dest=${SP_DEST} ${SP_PATH} ${SP_MEMB}.Next`
const PlayPreviousTrackDebianCmd = `dbus-send  --print-reply --dest=${SP_DEST} ${SP_PATH} ${SP_MEMB}.Previous`
const GetPlaybackStatus = `dbus-send --print-reply --dest=${SP_DEST} ${SP_PATH} ${DB_P_GET} string:${SP_MEMB} string:PlaybackStatus`
//@see https://gist.github.com/wandernauta/6800547
/**
 * Example response
trackid|spotify:track:4SQ0ytpTP8v1Rx8FWR22cv
length|354000000
artUrl|https://open.spotify.com/image/e51e7bc95101b3990d86ca58b18a6eb6ba057db3
album|In My Body
albumArtist|SYML
artist|SYML
autoRating|0.52
discNumber|1
title|The War
trackNumber|6
url|https://open.spotify.com/track/4SQ0ytpTP8v1Rx8FWR22cv
 */
const GetMetadataCommand = `dbus-send                                                                   \
--print-reply                                                                 \\
--dest=${SP_DEST}                                                             \\
${SP_PATH}                                                                    \\
org.freedesktop.DBus.Properties.Get                                         \\
string:"${SP_MEMB}" string:'Metadata'                                         \\
| grep -Ev "^method"                                                          \\
| grep -Eo '("(.*)")|(\\b[0-9][a-zA-Z0-9.]*\\b)'                                 \\
| sed -E '2~2 a|'                                                              \\
| tr -d '\\n'                                                                  \\
| sed -E 's/\\|/\\n/g'                                                           \\
| sed -E 's/(xesam:)|(mpris:)//'                                              \\
| sed -E 's/^"//'                                                         \\
| sed -E 's/"$//'                                                          \\
| sed -E 's/"+/|/'                                                           \\
| sed -E 's/ +/ /g'                            
`;

const terminalCommand = (cmd: string) => {
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
    return new Promise<string>((resolve, _reject) => {
        exec(cmd, (e, stdout, stderr) => {
            if (e) { return resolve(''); }
            if (stderr) { return resolve(''); }
            resolve(stdout);
        });
    });
};

export class LinuxSpotifyClient extends OsAgnosticSpotifyClient implements SpotifyClient {
    private currentOnVolume: number;

    constructor(spotifyStatusController: SpotifyStatusController) {
        super(spotifyStatusController);
    }

    private async getStatus(): Promise<SpotifyStatusState> {
        try {
            const playbackStatus = await terminalCommand(GetPlaybackStatus);
            const metadata = await terminalCommand(GetMetadataCommand);
            if (!playbackStatus || !metadata) {
                throw new Error('Spotify isn\'t running');
            }
            const state = ~playbackStatus.indexOf('Playing') ? 'playing' : 'paused';

            const result: SpotifyStatusState = {
                state: {
                    state,
                    volume: 100,//dbus doesn't return real value for this 
                    position: 0//dbus doesn't return real value for this
                },
                track: {
                    album: (/album\|(.+)/g.exec(metadata) || [])[1],
                    artist: (/artist\|(.+)/g.exec(metadata) || [])[1],
                    name: (/title\|(.+)/g.exec(metadata) || [])[1]
                },
                isRepeating: false,//dbus doesn't return real value for this
                isShuffling: false,//dbus doesn't return real value for this
                isRunning: true
            }
            return result;
        } catch (_ignored) {
            console.log(_ignored);
        }
        return Promise.reject<SpotifyStatusState>('Spotify isn\'t running');
    }
    pollStatus(cb: (status: SpotifyStatusState) => void, getInterval: () => number) {
        let canceled = false;
        const p = createCancelablePromise<void>((_, reject) => {
            const _poll = () => {
                if (canceled) {
                    return;
                }
                this.getStatus().then(status => {
                    cb(status);
                    setTimeout(() => _poll(), getInterval());
                }).catch(reject);
            };
            _poll();
        });
        p.promise = p.promise.catch((err) => {
            canceled === true;
            throw err;
        });
        return p;
    }

    next() {
        terminalCommand(PlayNextTrackDebianCmd)
    }

    previous() {
        terminalCommand(PlayPreviousTrackDebianCmd)
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
        return (foundSpotifySink != null) ? ((foundSpotifySink.length > 1) ? true : false) : false
    }

    async getCurrentVolume() {
        try {
            const d = await terminalCommand('pactl list sink-inputs');
            const sinkedArr = d.split('Sinked Input #')
            const a = sinkedArr ? sinkedArr.filter(this.findSpotify) : [];
            if (a.length > 0) {
                let currentVol = a[0].match(/(\d{1,3})%/i);
                if (currentVol != null) {
                    let sinkNum = a[0].match(/Sink Input #(\d{1,3})/);
                    if (currentVol.length > 1) {
                        if (parseInt(currentVol[1]) > 0 && sinkNum != null) {
                            return { sinkNum: sinkNum[1], volume: parseInt(currentVol[1]) };
                        }
                    }
                }
            }
        } catch (_ignored) {
        }
        return { sinkNum: null, volume: 0 };
    }

    async muteVolume() {
        const v = await this.getCurrentVolume();
        if (v.sinkNum && v.volume !== 0) {
            this.currentOnVolume = v.volume;
            terminalCommand(`pactl set-sink-input-volume ${v.sinkNum} ${this.currentOnVolume}%`);
        }
    }

    async unmuteVolume() {
        const v = await this.getCurrentVolume();
        if (v.sinkNum && v.volume === 0) {
            terminalCommand(`pactl set-sink-input-volume ${v.sinkNum} ${this.currentOnVolume}%`);
        }
    }

    async muteUnmuteVolume() {
        const v = await this.getCurrentVolume();
        if (v.sinkNum && v.volume > 0) {
            terminalCommand(`pactl set-sink-input-volume ${v.sinkNum} ${this.currentOnVolume}%`)
        } else { }
    }

    volumeUp() {
        terminalCommand('pactl list sink-inputs')
            .then((d: string) => {
                let sinkedArr = d.split('Sinked Input #')
                return (sinkedArr != null) ? sinkedArr.filter(this.findSpotify) : []
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
                return (sinkedArr != null) ? sinkedArr.filter(this.findSpotify) : []
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
}
