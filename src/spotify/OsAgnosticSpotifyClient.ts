import { SpotifyClient } from './SpotifyClient';
import { Spotilocal } from 'spotilocal';
import { Status } from 'spotilocal/src/status';
import { SpotifyStatus } from '../SpotifyStatus';
import { SpotifyStatusController } from '../SpotifyStatusController';
import { SpotifyStatusState } from '../SpotifyStatus';
import { showInformationMessage } from '../info/Info';

function returnIfNotInitialized(_ignoredTarget: any, _ignoredPropertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const fn = descriptor.value as Function;

    if (typeof fn !== 'function') {
        throw new Error(`@returnIfNotInitialized can only be applied to method and not to ${typeof fn}`)
    }

    return Object.assign({}, descriptor, {
        value: function () {
            if (!this.initialized) {
                showInformationMessage('Failed to initialize vscode-spotify. We\'ll keep trying every 20 seconds.');
                return;
            }
            return fn.apply(this, arguments);
        }
    })
}

function notSupported(_ignoredTarget: any, _ignoredPropertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const fn = descriptor.value as Function;

    if (typeof fn !== 'function') {
        throw new Error(`@notSupported can only be applied to method and not to ${typeof fn}`)
    }

    return Object.assign({}, descriptor, {
        value: function () {
            showInformationMessage('This functionality is not supported on this platform.');
            return;
        }
    })
}

function convertSpotilocalStatus(spotilocalStatus: Status): SpotifyStatusState {
    return {
        isRunning: true,
        state: {
            volume: spotilocalStatus.volume,
            position: spotilocalStatus.playing_position,
            state: spotilocalStatus.playing ? 'playing' : 'paused'
        },
        track: {
            artist: spotilocalStatus.track.artist_resource.name,
            name: spotilocalStatus.track.track_resource.name
        },
        isRepeating: spotilocalStatus.repeat,
        isShuffling: spotilocalStatus.shuffle
    };
}

export class OsAgnosticSpotifyClient implements SpotifyClient {
    private spotifyStatus: SpotifyStatus;
    private spotifyStatusController: SpotifyStatusController;
    private spotilocal: Spotilocal;
    private initialized: boolean;
    private showedReinitMessage: boolean;
    private initTimeoutId: number;    

    constructor(spotifyStatus: SpotifyStatus, spotifyStatusController: SpotifyStatusController) {
        this.spotifyStatus = spotifyStatus;
        this.spotifyStatusController = spotifyStatusController;
        this.spotilocal = new Spotilocal();

        this.retryInit();
    }
    private retryInit() {
        this.initialized = false;        
        this.initTimeoutId && clearTimeout(this.initTimeoutId);
        this.spotilocal.init().then(() => {
            this.initialized = true;
            this.showedReinitMessage = false;
        }).catch((_ignorredError) => {
            if (!this.showedReinitMessage){
                showInformationMessage('Failed to initialize vscode-spotify. We\'ll keep trying every 20 seconds.');
            }            
            this.showedReinitMessage = true;
            this.initTimeoutId = setTimeout(this.retryInit.bind(this), 20 * 1000);
        })
    }

    @notSupported
    next() {
    }
    @notSupported
    previous() {
    }
    @returnIfNotInitialized
    play() {
        this.spotilocal.pause(false).catch((error) => {
            showInformationMessage(`Failed to play. We are going to retry reinit spotilocal. ${error}`);
            this.retryInit.bind(this);
        });
    }
    @returnIfNotInitialized
    pause() {
        this.spotilocal.pause(true).then(() => {
            this.spotifyStatusController.queryStatus();
        }).catch((error) => {
            showInformationMessage(`Failed to pause. We are going to retry reinit spotilocal. ${error}`);
            this.retryInit.bind(this);
        });
    }
    @returnIfNotInitialized
    playPause() {
        this.spotilocal.getStatus().then((status) => {
            if (status.playing) {
                this.pause();
            } else {
                this.play();
            }
        }).catch((error) => {
            showInformationMessage(`Failed to playPause. We are going to retry reinit spotilocal. ${error}`);
            this.retryInit.bind(this)
        });;
    }
    pollStatus(cb: (status: SpotifyStatusState) => void): Promise<void> {
        if (!this.initialized) {
            return Promise.reject<void>('Failed to initiate status polling. spotilocal is not initialized');
        }

        return this.spotilocal.getStatus().then(status => {
            cb(convertSpotilocalStatus(status));
            return this.spotilocal.pollStatus(status => cb(convertSpotilocalStatus(status)));
        });
    }
    @notSupported
    muteVolume() {
    }
    @notSupported
    unmuteVolume() {
    }
    @notSupported
    muteUnmuteVolume() {
    }
    @notSupported
    volumeUp() {
    }
    @notSupported
    volumeDown() {
    }
    @notSupported
    toggleRepeating() {
    }
    @notSupported
    toggleShuffling() {
    }
}
