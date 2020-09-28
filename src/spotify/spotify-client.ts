import * as os from 'os';

import { QueryStatusFunction, SpotifyClient } from './common';

import { LinuxSpotifyClient } from './linux-spotify-client';
import { OsxSpotifyClient } from './osx-spotify-client';
import { isWebApiSpotifyClient } from '../config/spotify-config';
import { WebApiSpotifyClient } from './web-api-spotify-client';

export class SpoifyClientSingleton {
    static spotifyClient: SpotifyClient;
    static getSpotifyClient(queryStatus: QueryStatusFunction) {
        if (this.spotifyClient) {
            return this.spotifyClient;
        }

        const platform = os.platform();
        if (isWebApiSpotifyClient()) {
            this.spotifyClient = new WebApiSpotifyClient(queryStatus);
            return this.spotifyClient;
        }

        if (platform === 'darwin') {
            this.spotifyClient = new OsxSpotifyClient(queryStatus);
        }
        if (platform === 'linux') {
            this.spotifyClient = new LinuxSpotifyClient(queryStatus);
        }

        return this.spotifyClient;
    }
}
