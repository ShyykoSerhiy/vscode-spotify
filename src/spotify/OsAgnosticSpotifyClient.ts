import {window} from 'vscode';
import {SpotifyClient} from './SpotifyClient';
import {Spotilocal} from 'spotilocal';
import {SpotifyStatus} from '../SpotifyStatus';
import {SpotifyStatusController} from '../SpotifyStatusController';
import {SpotifyStatusState} from '../SpotifyStatus';

function returnIfNotInitialized(target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const fn = descriptor.value as Function;

    if (typeof fn !== 'function') {
        throw new Error(`@returnIfNotInitialized can only be applied to method and not to ${typeof fn}`)
    }

    return Object.assign({}, descriptor, {
        value: function () {
            if (!this.initialized) {
                window.showInformationMessage('Failed to initialize vscode-spotify. We\'ll keep trying every 20 seconds.');
                return;
            }
            return fn.apply(this, arguments);
        }
    })
}

function notSupported(target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const fn = descriptor.value as Function;

    if (typeof fn !== 'function') {
        throw new Error(`@notSupported can only be applied to method and not to ${typeof fn}`)
    }

    return Object.assign({}, descriptor, {
        value: function () {
            window.showInformationMessage('This functionality is not supported on this platfrom.');
            return;
        }
    })
}

export class OsAgnosticSpotifyClient implements SpotifyClient {
    private spotifyStatus: SpotifyStatus;
    private spotifyStatusController: SpotifyStatusController;
    private spotilocal: Spotilocal;
    private initialized: boolean;
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
        }).catch((error) => {
            window.showInformationMessage('Failed to initialize vscode-spotify. We\'ll keep trying every 20 seconds.');
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
            window.showInformationMessage(`Failed to play. We are going to retry reinit spotilocal. ${error}`);
            this.retryInit.bind(this);
        });
    }
    @returnIfNotInitialized
    pause() {
        this.spotilocal.pause(true).then(() => {
            this.spotifyStatusController.queryStatus();
        }).catch((error) => {
            window.showInformationMessage(`Failed to pause. We are going to retry reinit spotilocal. ${error}`);
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
            window.showInformationMessage(`Failed to playPause. We are going to retry reinit spotilocal. ${error}`);
            this.retryInit.bind(this)
        });;
    }
    getStatus(): Promise<SpotifyStatusState> {
        if (!this.initialized) {
            return Promise.reject<SpotifyStatusState>('Failed to get status. spotilocal is not initialized');
        }
        return this.spotilocal.getStatus().then((status) => {
            return {
                isRunning: true,
                state: {
                    volume: status.volume,
                    position: status.playing_position,
                    state: status.playing ? 'playing' : 'paused'
                },
                track: {
                    artist: status.track.artist_resource.name,
                    name: status.track.track_resource.name
                },
                isRepeating: status.repeat,
                isShuffling: status.shuffle
            }
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