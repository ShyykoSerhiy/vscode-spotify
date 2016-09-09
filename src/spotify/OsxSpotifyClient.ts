import {SpotifyClient} from './SpotifyClient';
import * as spotify from 'spotify-node-applescript';
import {SpotifyStatus} from '../SpotifyStatus';
import {SpotifyStatusController} from '../SpotifyStatusController';
import {SpotifyStatusState} from '../SpotifyStatus';

export class OsxSpotifyClient implements SpotifyClient {
    private spotifyStatus: SpotifyStatus;
    private spotifyStatusController: SpotifyStatusController;

    constructor(spotifyStatus: SpotifyStatus, spotifyStatusController: SpotifyStatusController) {
        this.spotifyStatus = spotifyStatus;
        this.spotifyStatusController = spotifyStatusController;
    }
    next() {
        spotify.next(() => { });
    }
    previous() {
        spotify.previous(() => { });
    }
    play() {
        spotify.play(() => { });
    }
    pause() {
        spotify.pause(() => { });
    }
    playPause() {
        spotify.playPause(() => { this.spotifyStatusController.queryStatus(); });
    }
    muteVolume() {
        spotify.muteVolume(() => { });
    }
    unmuteVolume() {
        spotify.unmuteVolume(() => { });
    }
    muteUnmuteVolume() {
        if (this.spotifyStatus.isMuted()) {
            spotify.unmuteVolume(() => { this.spotifyStatusController.queryStatus(); })
        } else {
            spotify.muteVolume(() => { this.spotifyStatusController.queryStatus(); })
        };
    }
    volumeUp() {
        spotify.volumeUp(() => { });
    }
    volumeDown() {
        spotify.volumeDown(() => { });
    }
    toggleRepeating() {
        spotify.toggleRepeating(() => { this.spotifyStatusController.queryStatus(); });
    }
    toggleShuffling() {
        spotify.toggleShuffling(() => { this.spotifyStatusController.queryStatus(); });
    }
    getStatus(): Promise<SpotifyStatusState> {
        return this._promiseIsRunning().then((isRunning) => {
            if (!isRunning) {
                return Promise.reject<SpotifyStatusState>('Spotify isn\'t running');
            }
            return Promise.all<spotify.State | spotify.Track | boolean>([
                this._promiseGetState(),
                this._promiseGetTrack(),
                this._promiseIsRepeating(),
                this._promiseIsShuffling()
            ]).then((values) => {
                const state = {
                    state: values[0] as spotify.State,
                    track: values[1] as spotify.Track,
                    isRepeating: values[2] as boolean,
                    isShuffling: values[3] as boolean,
                    isRunning: true
                }
                return state;
            });
        });
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