import { exec } from 'child_process';

import { log } from '../info/info';
import { ISpotifyStatusStatePartial } from '../state/state';

import { OsAgnosticSpotifyClient } from './os-agnostic-spotify-client';
import { createCancelablePromise, QueryStatusFunction, SpotifyClient } from './spotify-client';

const SP_DEST = 'org.mpris.MediaPlayer2.spotify';
const SP_PATH = '/org/mpris/MediaPlayer2';
const SP_MEMB = 'org.mpris.MediaPlayer2.Player';
const DB_P_GET = 'org.freedesktop.DBus.Properties.Get';
const createCommandString = (command: string) =>
    `dbus-send  --print-reply --dest=${SP_DEST} ${SP_PATH} ${SP_MEMB}.${command}`;
const playPauseDebianCmd = createCommandString('PlayPause');
const pauseDebianCmd = createCommandString('Pause');
const playNextTrackDebianCmd = createCommandString('Next');
const playPreviousTrackDebianCmd = createCommandString('Previous');
const getPlaybackStatus = `dbus-send --print-reply --dest=${SP_DEST} ${SP_PATH} ${DB_P_GET} string:${SP_MEMB} string:PlaybackStatus`;
// @see https://gist.github.com/wandernauta/6800547
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
const getMetadataCommand = `dbus-send                                                                   \
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

const terminalCommand = (cmd: string) =>
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
    new Promise<string>((resolve, _reject) => {
        exec(cmd, (e, stdout, stderr) => {
            if (e) { return resolve(''); }
            if (stderr) { return resolve(''); }
            resolve(stdout);
        });
    });

interface ICurrentVol { sinkNum: string | null; volume: number; }

export class LinuxSpotifyClient extends OsAgnosticSpotifyClient implements SpotifyClient {
    get queryStatusFunc() {
        return this._queryStatusFunc;
    }

    private currentOnVolume?: number;
    private _queryStatusFunc: QueryStatusFunction;

    constructor(_queryStatusFunc: QueryStatusFunction) {
        super();
        this._queryStatusFunc = () => {
            // spotify with dbfus doesn't return correct state right after next/prev/pause/play
            // command executtion. we need to wait
            setTimeout(_queryStatusFunc, /*magic number*/600);
        };
    }

    pollStatus(cb: (status: ISpotifyStatusStatePartial) => void, getInterval: () => number) {
        let canceled = false;
        const p = createCancelablePromise<void>((_, reject) => {
            const _poll = () => {
                if (canceled) {
                    return;
                }
                this.getStatus().then(status => {
                    cb(status);
                    setTimeout(_poll, getInterval());
                }).catch(reject);
            };
            _poll();
        });
        p.promise = p.promise.catch(err => {
            canceled = true;
            throw err;
        });
        return p;
    }

    play() {
        terminalCommand(playPauseDebianCmd);
    }

    pause() {
        terminalCommand(pauseDebianCmd);
    }

    async playPause() {
        await terminalCommand(playPauseDebianCmd);
        this._queryStatusFunc();
    }

    async next() {
        await terminalCommand(playNextTrackDebianCmd);
        this._queryStatusFunc();
    }

    async previous() {
        await terminalCommand(playPreviousTrackDebianCmd);
        this._queryStatusFunc();
    }

    /**
     *  This function checks to see which "Sinked Input #"
     *  is actually running spotify.
     *
     *  @param s The sting that might be contain the Sinked Input #
     *  we are looking for.
     *  @return This function was intended to be used with map in order
     *  to remap an Array where there should only be one element after we "findSpotify"
     */
    findSpotify(s: string) {
        const foundSpotifySink = s.match(/(Spotify)/i);
        return (foundSpotifySink != null) ? ((foundSpotifySink.length > 1) ? true : false) : false;
    }

    async getCurrentVolume(): Promise<ICurrentVol> {
        try {
            const d = await terminalCommand('pactl list sink-inputs');
            const sinkedArr = d.split('Sinked Input #');
            const a = sinkedArr ? sinkedArr.filter(this.findSpotify) : [];
            if (a.length > 0) {
                const currentVol = a[0].match(/(\d{1,3})%/i);
                if (currentVol != null) {
                    const sinkNum = a[0].match(/Sink Input #(\d{1,3})/);
                    if (currentVol.length > 1) {
                        if (parseInt(currentVol[1]) >= 0 && sinkNum != null) {
                            return { sinkNum: sinkNum[1], volume: parseInt(currentVol[1]) };
                        }
                    }
                }
            }
        } finally {
            return { sinkNum: null, volume: 0 };
        }
    }

    async muteVolume(currentVol?: ICurrentVol) {
        const v = currentVol || await this.getCurrentVolume();
        if (v.sinkNum && v.volume !== 0) {
            this.currentOnVolume = v.volume;
            this._setVolume(v.sinkNum, 0);
        }
    }

    async unmuteVolume(currentVol?: ICurrentVol) {
        const v = currentVol || await this.getCurrentVolume();
        if (v.sinkNum && v.volume === 0) {
            this._setVolume(v.sinkNum, this.currentOnVolume || 100);
        }
    }

    async muteUnmuteVolume() {
        const v = await this.getCurrentVolume();
        if (v.sinkNum) {
            if (v.volume === 0) {
                this.unmuteVolume(v);
            } else {
                this.muteVolume(v);
            }
        }
    }

    volumeUp() {
        terminalCommand('pactl list sink-inputs')
            .then((d: string) => {
                const sinkedArr = d.split('Sinked Input #');
                return (sinkedArr != null) ? sinkedArr.filter(this.findSpotify) : [];
            })
            .then((a: string[]) => {
                if (a.length > 0) {
                    const sinkNum = a[0].match(/Sink Input #(\d{1,3})/);
                    if (sinkNum != null) {
                        terminalCommand(`pactl set-sink-input-volume ${sinkNum[1]} +5%)`);
                    }
                }
            })
            .catch(log);
    }

    volumeDown() {
        terminalCommand('pactl list sink-inputs')
            .then((d: string) => {
                const sinkedArr = d.split('Sinked Input #');
                return (sinkedArr != null) ? sinkedArr.filter(this.findSpotify) : [];
            })
            .then((a: string[]) => {
                if (a.length > 0) {
                    const sinkNum = a[0].match(/Sink Input #(\d{1,3})/);
                    if (sinkNum != null) {
                        terminalCommand(`pactl set-sink-input-volume ${sinkNum[1]} -5%`);
                    }
                }
            })
            .catch(log);
    }

    private async getStatus(): Promise<ISpotifyStatusStatePartial> {
        try {
            const playbackStatus = await terminalCommand(getPlaybackStatus);
            const metadata = await terminalCommand(getMetadataCommand);
            if (!playbackStatus || !metadata) {
                throw new Error(`Spotify isn't running`);
            }
            const state = playbackStatus.indexOf('Playing') ? 'playing' : 'paused';

            const result: ISpotifyStatusStatePartial = {
                playerState: {
                    state,
                    volume: 100, // dbus doesn't return real value for this
                    position: 0, // dbus doesn't return real value for this,
                    isRepeating: false, // dbus doesn't return real value for this
                    isShuffling: false// dbus doesn't return real value for this
                },
                track: {
                    album: (/album\|(.+)/g.exec(metadata) || [])[1],
                    artist: (/artist\|(.+)/g.exec(metadata) || [])[1],
                    name: (/title\|(.+)/g.exec(metadata) || [])[1]
                },
                isRunning: true
            };
            return result;
        } finally {
            return Promise.reject<ISpotifyStatusStatePartial>(`Spotify isn't running`);
        }
    }

    private _setVolume(sinkNum: string, volume: number) {
        terminalCommand(`pactl set-sink-input-volume ${sinkNum} ${volume}%`);
    }
}
