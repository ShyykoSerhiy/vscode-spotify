import { OsAgnosticSpotifyClient } from './OsAgnosticSpotifyClient';
import { SpotifyStatus } from '../SpotifyStatus';
import { SpotifyStatusController } from '../SpotifyStatusController';
import { keybd_event } from 'node_keybd_event';

/**
 * Virtual keys. Full list https://msdn.microsoft.com/en-us/library/windows/desktop/dd375731(v=vs.85).aspx .
 */
const VK_VOLUME_MUTE = 0xAD;
const VK_VOLUME_DOWN = 0xAE;
const VK_VOLUME_UP = 0xAF;
const VK_MEDIA_NEXT_TRACK = 0xB0;
const VK_MEDIA_PREV_TRACK = 0xB1;

export class WindowsSpotifyClient extends OsAgnosticSpotifyClient {

    constructor(spotifyStatus: SpotifyStatus, spotifyStatusController: SpotifyStatusController) {
        super(spotifyStatus, spotifyStatusController);
    }

    next() {
        keybd_event(VK_MEDIA_NEXT_TRACK, 0, 0, 0);
    }

    previous() {
        keybd_event(VK_MEDIA_PREV_TRACK, 0, 0, 0);
    }

    muteVolume() {
        keybd_event(VK_VOLUME_MUTE, 0, 0, 0);
    }

    unmuteVolume() {
        keybd_event(VK_VOLUME_MUTE, 0, 0, 0);
    }

    muteUnmuteVolume() {
        keybd_event(VK_VOLUME_MUTE, 0, 0, 0);
    }

    volumeUp() {
        keybd_event(VK_VOLUME_UP, 0, 0, 0);
    }

    volumeDown() {
        keybd_event(VK_VOLUME_DOWN, 0, 0, 0);
    }
}
