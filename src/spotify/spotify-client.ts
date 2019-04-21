import * as os from 'os';

import { getForceWebApiImplementation } from '../config/spotify-config';
import { ISpotifyStatusStatePartial } from '../state/state';

import { LinuxSpotifyClient } from './linux-spotify-client';
import { OsxSpotifyClient } from './osx-spotify-client';
import { WebApiSpotifyClient } from './web-api-spotify-client';

export function isWebApiSpotifyClient() {
	const platform = os.platform();
	return (platform !== 'darwin' && platform !== 'linux') || getForceWebApiImplementation();
}

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

export const CANCELED_REASON = 'canceled' as 'canceled';
export const NOT_RUNNING_REASON = 'not_running' as 'not_running';

export function createCancelablePromise<T>(
	executor: (resolve: (value?: T | PromiseLike<T>) => void,
	reject: (reason?: any) => void) => void
) {
	let cancel: () => void = null as any;
	const promise = new Promise<T>((resolve, reject) => {
		cancel = () => {
			reject(CANCELED_REASON);
		};
		executor(resolve, reject);
	});
	return { promise, cancel };
}

export type QueryStatusFunction = () => void;

export interface SpotifyClient {
	queryStatusFunc: QueryStatusFunction;
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
