import {SpotifyStatus} from './SpotifyStatus';
import * as spotify from 'spotify-node-applescript';

export class SpotifyStatusController {
    private _spotifyStatus: SpotifyStatus;
    private _timeoutId: number;

    constructor(spotifyStatus: SpotifyStatus) {
        this._spotifyStatus = spotifyStatus;
        this.queryStatus();
    }

    scheduleQueryStatus() {
        this._timeoutId = setTimeout(() => {
            this.queryStatus();
        }, 1000);
    }

    /**
     * Retrieves status of spotify and passes it to spotifyStatus;
     */
    queryStatus() {
        spotify.isRunning((err, isRunning) => {
            if (isRunning) {
                spotify.getState((err, state) => {
                    if (state) {
                        spotify.getTrack((err, track) => {
                            if (track) {
                                this._spotifyStatus.state = {
                                    state: state,
                                    track: track,
                                    isRunning: isRunning
                                }                                                                
                            } else {
                                if (err){
                                    console.error(err, track);
                                }
                            }
                            this.scheduleQueryStatus();
                        });
                    } else {
                        if (err){
                            console.error(err, state);
                        }
                        this.scheduleQueryStatus();
                    }
                });
            } else {
                this._spotifyStatus.state = {
                    state: null,
                    track: null,
                    isRunning: false
                }
                if (err){
                    console.error(err, isRunning);
                }
                this.scheduleQueryStatus();
            }
        });
    }

    dispose() {
        clearTimeout(this._timeoutId);
    }
}