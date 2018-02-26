import { workspace, Memento } from 'vscode';
import { getState } from '../store/store';
import { BUTTON_ID_SIGN_IN, BUTTON_ID_SIGN_OUT } from '../consts/consts';


function getConfig() {
	return workspace.getConfiguration('spotify');
}

export function isButtonToBeShown(buttonId: string): boolean {
	const { loginState } = getState();
	if (buttonId === `${BUTTON_ID_SIGN_IN}Button`) {
		return !loginState;
	}
	if (buttonId === `${BUTTON_ID_SIGN_OUT}Button`) {
		return !!loginState;
	}

	return getConfig().get('show' + buttonId[0].toUpperCase() + buttonId.slice(1), false);
}

export function getButtonPriority(buttonId: string): number {
	const config = getConfig();
	return config.get('priorityBase', 0) + config.get(buttonId + 'Priority', 0);
}

export function getStatusCheckInterval(): number {
	return getConfig().get('statusCheckInterval', 5000);
}

export function getLyricsServerUrl(): string {
	return getConfig().get<string>('lyricsServerUrl', '');
}

export function getAuthServerUrl(): string {
	return getConfig().get<string>('authServerUrl', '');
}

export function openPanelLyrics(): number {
	return getConfig().get<number>('openPanelLyrics', 1);
}

export function getUseCombinedApproachOnMacOS(): boolean {
	return getConfig().get<boolean>('useCombinedApproachOnMacOS', false);
}

export function getShowInitializationError(): boolean {
	return getConfig().get<boolean>('showInitializationError', false);
}

export function getTrackInfoFormat(): string {
	return getConfig().get<string>('trackInfoFormat', '');
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
