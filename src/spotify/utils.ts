import * as os from 'os';

import { getForceWebApiImplementation } from '../config/spotify-config';

export function isWebApiSpotifyClient() {
    const platform = os.platform();
    return (platform !== 'darwin' && platform !== 'linux') || getForceWebApiImplementation();
}
