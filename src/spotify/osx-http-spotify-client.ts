import { SpotifyClient } from './spotify-client';
import { OsxSpotifyClient } from './osx-spotify-client';
import { OsAgnosticSpotifyClient } from './os-agnostic-spotify-client'
import { ISpotifyStatusState } from '../state/state';

/**
 * Spotify client that uses both applescript(for next, mute, ...) and OsAgnostic(local http client for less CPU usage) approaches. 
 */
export class OsxHttpSpotifyClient extends OsxSpotifyClient implements SpotifyClient {
    private osAgnosticSpotifyClient: OsAgnosticSpotifyClient;

    constructor() {
        super();
        this.osAgnosticSpotifyClient = new OsAgnosticSpotifyClient();
    }

    pollStatus(cb: (status: ISpotifyStatusState) => void, _getInterval: () => number) {
        return this.osAgnosticSpotifyClient.pollStatus(cb);
    }
}
