import { SpotifyClient, createCancelablePromise, QueryStatusFunction } from './spotify-client';
import * as spotify from 'spotify-node-applescript';
import { ISpotifyStatusStatePartial } from '../state/state';
import { isMuted } from '../store/store';

export class OsxSpotifyClient implements SpotifyClient {
    private _queryStatusFunc: QueryStatusFunction

    constructor(queryStatusFunc: QueryStatusFunction) {
        this._queryStatusFunc = queryStatusFunc;        
    }
    get queryStatusFunc() {
        return this._queryStatusFunc;
    }

    next() {
        spotify.next(this._queryStatusFunc);
    }
    previous() {
        spotify.previous(this._queryStatusFunc);
    }
    play() {
        spotify.play(this._queryStatusFunc);
    }
    pause() {
        spotify.pause(this._queryStatusFunc);
    }
    playPause() {
        spotify.playPause(this._queryStatusFunc);
    }
    muteVolume() {
        spotify.muteVolume(this._queryStatusFunc);
    }
    unmuteVolume() {
        spotify.unmuteVolume(this._queryStatusFunc);
    }
    muteUnmuteVolume() {
        if (isMuted()) {
            spotify.unmuteVolume(this._queryStatusFunc)
        } else {
            spotify.muteVolume(this._queryStatusFunc)
        };
    }
    volumeUp() {
        spotify.volumeUp(this._queryStatusFunc);
    }
    volumeDown() {
        spotify.volumeDown(this._queryStatusFunc);
    }
    toggleRepeating() {
        spotify.toggleRepeating(this._queryStatusFunc);
    }
    toggleShuffling() {
        spotify.toggleShuffling(this._queryStatusFunc);
    }
    private getStatus(): Promise<ISpotifyStatusStatePartial> {
        return this._promiseIsRunning().then((isRunning) => {
            if (!isRunning) {
                return Promise.reject<ISpotifyStatusStatePartial>('Spotify isn\'t running');
            }
            return Promise.all<spotify.State | spotify.Track | boolean>([
                this._promiseGetState(),
                this._promiseGetTrack(),
                this._promiseIsRepeating(),
                this._promiseIsShuffling()
            ]).then((values) => {
                const spState = values[0] as spotify.State & { state: 'playing' | 'paused' };
                const state: ISpotifyStatusStatePartial = {
                    playerState: Object.assign(spState, {
                        isRepeating: values[2] as boolean,
                        isShuffling: values[3] as boolean,
                    }),
                    track: values[1] as spotify.Track,
                    isRunning: true
                }
                return state;
            }) as any;
        });
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
                    setTimeout(() => _poll(), getInterval());
                }).catch(reject);
            };
            _poll();
        });
        p.promise = p.promise.catch((err) => {
            canceled = true;
            throw err;
        });
        return p;
    }
    private _promiseIsRunning() {
        return new Promise<boolean>((resolve, reject) => {
            spotify.isRunning((err, isRunning) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(isRunning);
                }
            });
        });
    }

    private _promiseGetState() {
        return new Promise<spotify.State>((resolve, reject) => {
            spotify.getState((err, state) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(state);
                }
            });
        });
    }

    private _promiseGetTrack() {
        return new Promise<spotify.Track>((resolve, reject) => {
            spotify.getTrack((err, track) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(track);
                }
            });
        });
    }

    private _promiseIsRepeating() {
        return new Promise<boolean>((resolve, reject) => {
            spotify.isRepeating((err, repeating) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(repeating);
                }
            });
        });
    }

    private _promiseIsShuffling() {
        return new Promise<boolean>((resolve, reject) => {
            spotify.isShuffling((err, shuffling) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(shuffling);
                }
            });
        });
    }
}
