import { SpoifyClientSingleton } from './spotify/spotify-client';
import { getStatusCheckInterval } from './config/spotify-config';
import { actionsCreator } from './actions/actions';

export class SpotifyStatusController {
    private _timeoutId?: NodeJS.Timer;
    private _retryCount: number;
    private _cancelCb?: () => void;
    /**
     * How many sequential errors is needed to hide all buttons
     */
    private _maxRetryCount: number;

    constructor() {
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
                actionsCreator.updateStateAction({
                    playerState: {
                        position: 0, volume: 0, state: 'paused', isRepeating: false,
                        isShuffling: false
                    },
                    track: { album: '', artist: '', name: '' },
                    isRunning: false
                });
                this._retryCount = 0;
            }
            this.scheduleQueryStatus();
        });

        const { promise, cancel } = SpoifyClientSingleton.getSpotifyClient().pollStatus(status => {
            actionsCreator.updateStateAction(status);
            this._retryCount = 0;
        }, getStatusCheckInterval);
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

    private _cancelPreviousPoll() {
        this._cancelCb && this._cancelCb();
    }
}
