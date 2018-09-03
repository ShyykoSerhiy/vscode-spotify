import { SpotifyClient, createCancelablePromise } from './spotify-client';
import { ISpotifyStatusStatePartial } from '../state/state';
import { showInformationMessage } from '../info/info';

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

    constructor() {
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
    pollStatus(_cb: (status: ISpotifyStatusStatePartial) => void, _getInterval: () => number) {
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
