/**
 * @deprecated @see https://github.com/ShyykoSerhiy/spotilocal/issues/7#issuecomment-416002808
 */

import { SpotifyClient } from './SpotifyClient';
import { OsxSpotifyClient } from './OsxSpotifyClient';
import { OsAgnosticSpotifyClient } from './OsAgnosticSpotifyClient'
import { SpotifyStatus } from '../SpotifyStatus';
import { SpotifyStatusController } from '../SpotifyStatusController';
import { SpotifyStatusState } from '../SpotifyStatus';

/**
 * Spotify client that uses both applescript(for next, mute, ...) and OsAgnostic(local http client for less CPU usage) approaches. 
 */
export class OsxHttpSpotifyClient extends OsxSpotifyClient implements SpotifyClient {
    private osAgnosticSpotifyClient: OsAgnosticSpotifyClient;

    constructor(spotifyStatus: SpotifyStatus, spotifyStatusController: SpotifyStatusController) {
        super(spotifyStatus, spotifyStatusController)
        this.osAgnosticSpotifyClient = new OsAgnosticSpotifyClient(spotifyStatusController);
    }

    pollStatus(cb: (status: SpotifyStatusState) => void, _getInterval: () => number) {
        return this.osAgnosticSpotifyClient.pollStatus(cb, _getInterval);
    }
}
