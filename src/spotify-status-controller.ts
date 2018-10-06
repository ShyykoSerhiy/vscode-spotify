import { SpoifyClientSingleton, CANCELED_REASON } from './spotify/spotify-client';
import { getStatusCheckInterval } from './config/spotify-config';
import { actionsCreator } from './actions/actions';
import autobind from 'autobind-decorator';

export class SpotifyStatusController {
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

    /**
     * Retrieves status of spotify and passes it to spotifyStatus;
     */
    @autobind
    public queryStatus() {
        this._cancelPreviousPoll();
        const { promise, cancel } = SpoifyClientSingleton.getSpotifyClient(this.queryStatus).pollStatus(status => {
            actionsCreator.updateStateAction(status);
            this._retryCount = 0;
        }, getStatusCheckInterval);
        this._cancelCb = cancel;
        promise.catch(this.clearState);
    }

    private clearState = (reason: any) => {
        // canceling of the promise only happens when method queryStatus is triggered. 
        if (reason !== CANCELED_REASON) {
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
            setTimeout(this.queryStatus, getStatusCheckInterval());            
        }
    };

    dispose() {
        this._cancelPreviousPoll();
    }

    private _cancelPreviousPoll() {
        this._cancelCb && this._cancelCb();
    }
}
