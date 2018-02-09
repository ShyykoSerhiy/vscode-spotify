import { workspace, Memento } from 'vscode';

function getConfig() {
	return workspace.getConfiguration('spotify');
}

export function isButtonToBeShown(buttonName: string): boolean {
	return getConfig().get('show' + buttonName[0].toUpperCase() + buttonName.slice(1), false);
}

export function getButtonPriority(buttonName: string): number {
	const config = getConfig();
	return config.get('priorityBase', 0) + config.get(buttonName + 'Priority', 0);
}

export function getStatusCheckInterval(): number {
	return getConfig().get('statusCheckInterval', 5000);
}

export function getLyricsServerUrl(): string {
	return getConfig().get<string>('lyricsServerUrl', '');
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

export function registerGlobalState(memento: Memento)  {
	globalState = memento;
}

const LAST_USED_PORT = 'lastUsedPort';

export function getLastUsedPort() {
	return globalState.get<number>(LAST_USED_PORT);
}

export function setLastUsedPort(port: number) {
	globalState.update(LAST_USED_PORT, port);
}
