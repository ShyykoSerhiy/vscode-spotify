import {SpotifyStatus} from './SpotifyStatus';
import * as spotify from 'spotify-node-applescript';

export class SpotifyStatusController {
    private _spotifyStatus: SpotifyStatus;
    private _timeoutId: number;
    private _retryCount: number;
    /**
     * How many sequential errors is needed to hide all buttons
     */
    private _maxRetryCount: number;

    constructor(spotifyStatus: SpotifyStatus) {
        this._timeoutId = null;
        this._spotifyStatus = spotifyStatus;
        this._retryCount = 0;
        this._maxRetryCount = 5;
        this.queryStatus();
    }

    scheduleQueryStatus() {
        this._clearQueryTimeout();
        this._timeoutId = setTimeout(() => {
            this.queryStatus();
        }, 1000);
    }

    /**
     * Retrieves status of spotify and passes it to spotifyStatus;
     */
    queryStatus() {   
        this._clearQueryTimeout();    
        var clearState = ((err: any) => {
            this._retryCount++;
            if (this._retryCount >= this._maxRetryCount){ 
                this._spotifyStatus.state = {
                    state: null,
                    track: null,
                    isRepeating: false,
                    isShuffling: false,
                    isRunning: false
                };
                this._retryCount = 0;
            }
            this.scheduleQueryStatus();
        });

        this._promiseIsRunning().then((isRunning) => {
            Promise.all<spotify.State | spotify.Track | boolean>([
                this._promiseGetState(),
                this._promiseGetTrack(),
                this._promiseIsRepeating(),
                this._promiseIsShuffling()
            ]).then((values) => {
                this._spotifyStatus.state = {
                    state: values[0] as spotify.State,
                    track: values[1] as spotify.Track,
                    isRepeating: values[2] as boolean,
                    isShuffling: values[3] as boolean,
                    isRunning: true
                }
                this._retryCount = 0;
                this.scheduleQueryStatus();
            }).catch(clearState);
        }).catch(clearState);
    }

    dispose() {
        clearTimeout(this._timeoutId);
    }
    
    private _clearQueryTimeout(){
         if (this._timeoutId !== null){
            clearTimeout(this._timeoutId);
            this._timeoutId = null;
        }
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