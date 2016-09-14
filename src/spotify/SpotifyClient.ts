import * as spotify from 'spotify-node-applescript';
import {Spotilocal} from 'spotilocal';
import {SpotifyStatus} from '../SpotifyStatus';
import {SpotifyStatusController} from '../SpotifyStatusController';
import {OsAgnosticSpotifyClient} from './OsAgnosticSpotifyClient';
import {OsxSpotifyClient} from './OsxSpotifyClient';
import {SpotifyStatusState} from '../SpotifyStatus';
import * as os from 'os';

export class SpoifyClientSingleton {
    private static spotifyClient: SpotifyClient;
    public static getSpotifyClient(spotifyStatus: SpotifyStatus, spotifyStatusController: SpotifyStatusController) {
        if (this.spotifyClient) {
            return this.spotifyClient;
        }
        this.spotifyClient = (os.platform() === 'darwin') ?
            new OsxSpotifyClient(spotifyStatus, spotifyStatusController) :
            new OsAgnosticSpotifyClient(spotifyStatus, spotifyStatusController);
        return this.spotifyClient;
    }
}

export interface SpotifyClient {
    next(): void;
    previous(): void;
    play(): void;
    pause(): void;
    playPause(): void;
    muteVolume(): void;
    unmuteVolume(): void;
    muteUnmuteVolume(): void;
    volumeUp(): void;
    volumeDown(): void;
    toggleRepeating(): void;
    toggleShuffling(): void;
    getStatus(): Promise<SpotifyStatusState>;
}