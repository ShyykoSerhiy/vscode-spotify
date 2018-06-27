import { SpotifyClient }   from './SpotifyClient';
import { SpotifyStatusController }                  from '../SpotifyStatusController';
import { exec }                                     from 'child_process'; 
import { OsAgnosticSpotifyClient } from './OsAgnosticSpotifyClient';

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

export class LinuxSpotifyClient extends OsAgnosticSpotifyClient implements SpotifyClient {
    private currentOnVolume: string;

    constructor(spotifyStatusController: SpotifyStatusController) {
        super(spotifyStatusController);
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
}
