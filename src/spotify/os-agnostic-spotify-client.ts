import { SpotifyClient, createCancelablePromise } from './SpotifyClient';
import { SpotifyStatusController } from '../SpotifyStatusController';
import { SpotifyStatusState } from '../SpotifyStatus';
import { showInformationMessage } from '../info/Info';

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

export class OsAgnosticSpotifyClient implements SpotifyClient {
    protected spotifyStatusController: SpotifyStatusController;

    constructor(spotifyStatusController: SpotifyStatusController) {
        this.spotifyStatusController = spotifyStatusController;
    }

    @notSupported
    next() {
    }
    @notSupported
    previous() {
    }
    @notSupported
    play() {
    }
    @notSupported
    pause() {
    }
    @notSupported
    playPause() {
    }
    @notSupported
    pollStatus(_cb: (status: SpotifyStatusState) => void, _getInterval: () => number) {
        return createCancelablePromise<void>((_resolve, _reject) => {});
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
