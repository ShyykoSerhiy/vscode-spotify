import { SpotifyClient, createCancelablePromise } from './spotify-client';
import { Spotilocal } from 'spotilocal';
import { Status } from 'spotilocal/src/status';
import { ISpotifyStatusState } from '../state/state';
import { showInformationMessage } from '../info/Info';
import { getShowInitializationError, setLastUsedPort, getLastUsedPort } from '../config/spotify-config'

function returnIfNotInitialized(_ignoredTarget: any, _ignoredPropertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const fn = descriptor.value as Function;

    if (typeof fn !== 'function') {
        throw new Error(`@returnIfNotInitialized can only be applied to method and not to ${typeof fn}`)
    }

    return Object.assign({}, descriptor, {
        value: function () {
            if (!this.initialized && getShowInitializationError()) {
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

function convertSpotilocalStatus(spotilocalStatus: Status): ISpotifyStatusState {
    return {
        isRunning: true,
        playerState: {
            volume: spotilocalStatus.volume,
            position: spotilocalStatus.playing_position,
            state: spotilocalStatus.playing ? 'playing' : 'paused',
            isRepeating: spotilocalStatus.repeat,
            isShuffling: spotilocalStatus.shuffle
        },
        track: {
            album: spotilocalStatus.track.album_resource.name,
            artist: spotilocalStatus.track.artist_resource.name,
            name: spotilocalStatus.track.track_resource.name
        }
    };
}

const EMPTY_FN = () => { };

export class OsAgnosticSpotifyClient implements SpotifyClient {
    private spotilocal: Spotilocal;
    private initialized: boolean;
    private showedReinitMessage: boolean;
    private initTimeoutId: number;

    constructor() {
        this.spotilocal = new Spotilocal();
        this.retryInit();
    }

    private retryInit() {
        this.initialized = false;
        this.initTimeoutId && clearTimeout(this.initTimeoutId);
        const lastUsedPort = getLastUsedPort();
        this.spotilocal.init(lastUsedPort).then(() => {
            this.initialized = true;
            this.showedReinitMessage = false;

            setLastUsedPort(this.spotilocal.port);
        }).catch((ignorredError) => {
            if (!this.showedReinitMessage && getShowInitializationError()) {
                showInformationMessage('Failed to initialize vscode-spotify. We\'ll keep trying every 20 seconds.');
            }
            console.error('Failed to initialize vscode-spotify. We\'ll keep trying every 20 seconds.', ignorredError);
            this.showedReinitMessage = true;
            this.initTimeoutId = setTimeout(this.retryInit.bind(this), 20 * 1000);
        });
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
        this.spotilocal.pause(true).catch((error) => {
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
    pollStatus(cb: (status: ISpotifyStatusState) => void) {
        if (!this.initialized) {
            return { promise: Promise.reject<void>('Failed to initiate status polling. spotilocal is not initialized'), cancel: EMPTY_FN };
        }

        let canceled = false;
        const p = createCancelablePromise<void>((_resolve, reject) => {
            this.spotilocal.getStatus().then(status => {
                cb(convertSpotilocalStatus(status));
                const _poll = () => {
                    if (canceled) {
                        return;
                    }
                    this.spotilocal.getStatus(['play', 'pause'], 0).then(status => {
                        cb(convertSpotilocalStatus(status));
                        _poll();
                    }).catch(reject);
                };
                _poll();
            }).catch(reject);
        });
        p.promise = p.promise.catch((err) => {
            if (err && err.code === 'ECONNREFUSED') {
                this.retryInit();
            }

            canceled = true;
            throw err;
        });
        return p;
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
