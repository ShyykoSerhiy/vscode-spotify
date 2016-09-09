import {commands, Disposable, window} from 'vscode';
import * as spotify from 'spotify-node-applescript';
import {Spotilocal} from 'spotilocal';
import {SpotifyStatus} from './SpotifyStatus';
import {SpotifyStatusController} from './SpotifyStatusController';
import {SpoifyClientSingleton} from './spotify/SpotifyClient'

export function createCommands(spotifyStatus: SpotifyStatus, spotifyStatusController: SpotifyStatusController): { dispose: () => void } {
	var sC = SpoifyClientSingleton.getSpotifyClient(spotifyStatus, spotifyStatusController);
	const next = commands.registerCommand('spotify.next', sC.next.bind(sC));
	const previous = commands.registerCommand('spotify.previous', sC.previous.bind(sC));
	const play = commands.registerCommand('spotify.play', sC.play.bind(sC));
	const pause = commands.registerCommand('spotify.pause', sC.pause.bind(sC));
	const playPause = commands.registerCommand('spotify.playPause', sC.playPause.bind(sC));
	const muteVolume = commands.registerCommand('spotify.muteVolume', sC.muteVolume.bind(sC));
	const unmuteVolume = commands.registerCommand('spotify.unmuteVolume', sC.unmuteVolume.bind(sC));
	const muteUnmuteVolume = commands.registerCommand('spotify.muteUnmuteVolume', sC.muteUnmuteVolume.bind(sC));
	const volumeUp = commands.registerCommand('spotify.volumeUp', sC.volumeUp.bind(sC));
	const volumeDown = commands.registerCommand('spotify.volumeDown', sC.volumeDown.bind(sC));
	const toggleRepeating = commands.registerCommand('spotify.toggleRepeating', sC.toggleRepeating.bind(sC));
	const toggleShuffling = commands.registerCommand('spotify.toggleShuffling', sC.toggleShuffling.bind(sC));
	return Disposable.from(next, previous, play, pause, playPause, muteVolume, unmuteVolume, volumeUp, volumeDown, toggleRepeating, toggleShuffling);
}