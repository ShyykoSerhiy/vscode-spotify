import { workspace, Memento } from 'vscode';
import { getState } from '../store/store';
import { BUTTON_ID_SIGN_IN, BUTTON_ID_SIGN_OUT } from '../consts/consts';
import { isWebApiSpotifyClient } from '../spotify/spotify-client';

export function getConfig() {
	return workspace.getConfiguration('spotify');
}

export function isButtonToBeShown(buttonId: string): boolean {
	const shouldShow = getConfig().get('show' + buttonId[0].toUpperCase() + buttonId.slice(1), false);
	const { loginState } = getState();

	if (buttonId === `${BUTTON_ID_SIGN_IN}Button`) {
		return shouldShow && !loginState;
	} else if (buttonId === `${BUTTON_ID_SIGN_OUT}Button`) {
		return shouldShow && !!loginState;
	}

	return shouldShow;
}

export function getButtonPriority(buttonId: string): number {
	const config = getConfig();
	return config.get('priorityBase', 0) + config.get(buttonId + 'Priority', 0);
}

export function getStatusCheckInterval(): number {
	const isWebApiClient = isWebApiSpotifyClient();
	let interval = getConfig().get('statusCheckInterval', 5000);
	if (isWebApiClient) {
		interval = Math.max(interval, 5000);
	}
	return interval;
}

export function getLyricsServerUrl(): string {
	return getConfig().get<string>('lyricsServerUrl', '');
}

export function getAuthServerUrl(): string {
	return getConfig().get<string>('authServerUrl', '');
}

export function getSpotifyApiUrl(): string {
	return getConfig().get<string>('spotifyApiUrl', '');
}

export function openPanelLyrics(): number {
	return getConfig().get<number>('openPanelLyrics', 1);
}

export function getTrackInfoFormat(): string {
	return getConfig().get<string>('trackInfoFormat', '');
}

export function getForceWebApiImplementation(): boolean {
	return getConfig().get<boolean>('forceWebApiImplementation', false);
}

export function getEnableLogs(): boolean {
	return getConfig().get<boolean>('enableLogs', false);
}

export type TrackInfoClickBehaviour = 'none' | 'focus_song' | 'play_pause';

export function getTrackInfoClickBehaviour(): TrackInfoClickBehaviour {
	return getConfig().get<TrackInfoClickBehaviour>('trackInfoClickBehaviour', 'focus_song');
}

let globalState: Memento;

export function registerGlobalState(memento: Memento) {
	globalState = memento;
}

const LAST_USED_PORT = 'lastUsedPort';

export function getLastUsedPort() {
	return globalState.get<number>(LAST_USED_PORT);
}

export function setLastUsedPort(port: number) {
	globalState.update(LAST_USED_PORT, port);
}
