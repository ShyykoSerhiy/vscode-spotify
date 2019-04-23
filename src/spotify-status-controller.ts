import autobind from 'autobind-decorator';

import { actionsCreator } from './actions/actions';
import { getStatusCheckInterval } from './config/spotify-config';
import { CANCELED_REASON, SpoifyClientSingleton } from './spotify/spotify-client';

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
    queryStatus() {
        this._cancelPreviousPoll();
        const { promise, cancel } = SpoifyClientSingleton.getSpotifyClient(this.queryStatus).pollStatus(status => {
            actionsCreator.updateStateAction(status);
            this._retryCount = 0;
        }, getStatusCheckInterval);
        this._cancelCb = cancel;
        promise.catch(this.clearState);
    }

    dispose() {
        this._cancelPreviousPoll();
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
    }

    private _cancelPreviousPoll() {
        if (this._cancelCb) {
            this._cancelCb();
        }
    }
}
