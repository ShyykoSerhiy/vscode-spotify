import {commands, Disposable} from 'vscode';
import * as spotify from 'spotify-node-applescript';

export function createCommands(): { dispose: () => void } {
	const next = commands.registerCommand('spotify.next', () => {
		spotify.next(() => { });
    });
	const previous = commands.registerCommand('spotify.previous', () => {
		spotify.previous(() => { });
    });
	const play = commands.registerCommand('spotify.play', () => {
		spotify.play(() => { });
    });
	const pause = commands.registerCommand('spotify.pause', () => {
		spotify.pause(() => { });
    });
	const playPause = commands.registerCommand('spotify.playPause', () => {
		spotify.playPause(() => { });
    });
	const muteVolume = commands.registerCommand('spotify.muteVolume', () => {
		spotify.muteVolume(() => { });
    });
	const unmuteVolume = commands.registerCommand('spotify.unmuteVolume', () => {
		spotify.unmuteVolume(() => { });
    });
	const volumeUp = commands.registerCommand('spotify.volumeUp', () => {
		spotify.volumeUp(() => { });
    });
	const volumeDown = commands.registerCommand('spotify.volumeDown', () => {
		spotify.volumeDown(() => { });
    });
	return Disposable.from(next, previous, play, pause, playPause, muteVolume, unmuteVolume, volumeUp, volumeDown);
}