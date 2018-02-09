import { SpotifyClient, createCancelablePromise } from './spotify-client';
import * as spotify from 'spotify-node-applescript';
import { ISpotifyStatusState } from '../state/state';
import { isMuted } from '../store/store';

export class OsxSpotifyClient implements SpotifyClient {

    constructor() {
        this._queryStatus = this._queryStatus.bind(this);
    }
    next() {
        spotify.next(this._queryStatus);
    }
    previous() {
        spotify.previous(this._queryStatus);
    }
    play() {
        spotify.play(this._queryStatus);
    }
    pause() {
        spotify.pause(this._queryStatus);
    }
    playPause() {
        spotify.playPause(this._queryStatus);
    }
    muteVolume() {
        spotify.muteVolume(this._queryStatus);
    }
    unmuteVolume() {
        spotify.unmuteVolume(this._queryStatus);
    }
    muteUnmuteVolume() {
        if (isMuted()) {
            spotify.unmuteVolume(this._queryStatus)
        } else {
            spotify.muteVolume(this._queryStatus)
        };
    }
    volumeUp() {
        spotify.volumeUp(this._queryStatus);
    }
    volumeDown() {
        spotify.volumeDown(this._queryStatus);
    }
    toggleRepeating() {
        spotify.toggleRepeating(this._queryStatus);
    }
    toggleShuffling() {
        spotify.toggleShuffling(this._queryStatus);
    }
    private getStatus(): Promise<ISpotifyStatusState> {
        return this._promiseIsRunning().then((isRunning) => {
            if (!isRunning) {
                return Promise.reject<ISpotifyStatusState>('Spotify isn\'t running');
            }
            return Promise.all<spotify.State | spotify.Track | boolean>([
                this._promiseGetState(),
                this._promiseGetTrack(),
                this._promiseIsRepeating(),
                this._promiseIsShuffling()
            ]).then((values) => {
                const spState = values[0] as spotify.State & { state: 'playing' | 'paused' };
                const state: ISpotifyStatusState = {
                    playerState: Object.assign(spState, {
                        isRepeating: values[2] as boolean,
                        isShuffling: values[3] as boolean,
                    }),
                    track: values[1] as spotify.Track,
                    isRunning: true
                }
                return state;
            });
        });
    }
    pollStatus(cb: (status: ISpotifyStatusState) => void, getInterval: () => number) {
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
    private _queryStatus() {
        //this.spotifyStatusController.queryStatus(); //fixime
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
