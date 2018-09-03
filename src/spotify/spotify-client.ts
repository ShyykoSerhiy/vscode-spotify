import {SpotifyStatus} from '../SpotifyStatus';
import {SpotifyStatusController} from '../SpotifyStatusController';
import {OsAgnosticSpotifyClient} from './OsAgnosticSpotifyClient';
import { LinuxSpotifyClient} from './LinuxSpotifyClient';
import {OsxSpotifyClient} from './OsxSpotifyClient';
import {OsxHttpSpotifyClient} from './OsxHttpSpotifyClient';
import {SpotifyStatusState} from '../SpotifyStatus';
import {getUseCombinedApproachOnMacOS} from '../config/SpotifyConfig';
import * as os from 'os';

export class SpoifyClientSingleton {
    private static spotifyClient: SpotifyClient;
    public static getSpotifyClient() {
        if (this.spotifyClient) {
            return this.spotifyClient;
        }
        
        this.spotifyClient = (os.platform() === 'darwin') ?
            (getUseCombinedApproachOnMacOS() ? 
                  new OsxHttpSpotifyClient(spotifyStatus, spotifyStatusController) 
                : new OsxSpotifyClient(spotifyStatus, spotifyStatusController)) 
                : ((os.platform() === 'linux') ? 
                      new LinuxSpotifyClient(spotifyStatusController) 
                    : new OsAgnosticSpotifyClient(spotifyStatusController));
        return this.spotifyClient;
    }
}

export function createCancelablePromise<T>(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) {
    let cancel: () => void = null as any;
    const promise = new Promise<T>((resolve, reject) => {
        cancel = () => {
            reject('canceled');
        }
        executor(resolve, reject);
    })
    return { promise, cancel }
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
    pollStatus(cb: (status: ISpotifyStatusStatePartial) => void, getInterval: () => number): { promise: Promise<void>, cancel: () => void };
}
