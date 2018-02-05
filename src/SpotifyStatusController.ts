import { Memento } from 'vscode';
import { SpotifyStatus } from './SpotifyStatus';
import { SpoifyClientSingleton } from './spotify/SpotifyClient';
import { getStatusCheckInterval } from './config/SpotifyConfig';

export class SpotifyStatusController {
    public globalState: Memento;
    private _spotifyStatus: SpotifyStatus;
    private _timeoutId?: NodeJS.Timer;
    private _retryCount: number;
    private _cancelCb?: ()=>void;
    /**
     * How many sequential errors is needed to hide all buttons
     */
    private _maxRetryCount: number;

    constructor(spotifyStatus: SpotifyStatus, globalState: Memento) {
        this.globalState = globalState;
        this._spotifyStatus = spotifyStatus;
        this._retryCount = 0;
        this._maxRetryCount = 5;
        this.queryStatus();
    }

    scheduleQueryStatus() {
        this._cancelPreviousPoll();
        this._clearQueryTimeout();
        this._timeoutId = setTimeout(() => {
            this.queryStatus();
        }, getStatusCheckInterval());
    }

    /**
     * Retrieves status of spotify and passes it to spotifyStatus;
     */
    queryStatus() {
        this._cancelPreviousPoll();
        this._clearQueryTimeout();
        var clearState = (() => {
            this._retryCount++;
            if (this._retryCount >= this._maxRetryCount) {
                this._spotifyStatus.state = {
                    state: { position: 0, volume: 0, state: '' },
                    track: { album: '', artist: '', name: '' },
                    isRepeating: false,
                    isShuffling: false,
                    isRunning: false
                };
                this._retryCount = 0;
            }
            this.scheduleQueryStatus();
        });

        const { promise, cancel } = SpoifyClientSingleton.getSpotifyClient(this._spotifyStatus, this).pollStatus(status => {
            this._spotifyStatus.state = status;
            this._retryCount = 0;
        }, getStatusCheckInterval)
        this._cancelCb = cancel;
        promise.catch(clearState);
    }

    dispose() {
        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
        }
    }

    private _clearQueryTimeout() {
        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
            this._timeoutId = void 0;
        }
    }

    private _cancelPreviousPoll(){
        this._cancelCb && this._cancelCb();
    }
}
