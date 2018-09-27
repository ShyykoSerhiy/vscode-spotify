import { commands, Disposable } from 'vscode';
import { SpoifyClientSingleton } from './spotify/spotify-client';
import { LyricsController, registration } from './lyrics/lyrics';
import { actionsCreator } from './actions/actions';

export function createCommands(): { dispose: () => void } {
	var sC = SpoifyClientSingleton.getSpotifyClient();
	const lC = new LyricsController();
	const lyrics = commands.registerCommand('spotify.lyrics', lC.findLyrics.bind(lC));
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
	const signIn = commands.registerCommand('spotify.signIn', actionsCreator.actionSignIn);
	const signOut = commands.registerCommand('spotify.signOut', actionsCreator.actionSignOut);
	const loadPlaylists = commands.registerCommand('spotify.loadPlaylists', actionsCreator.loadPlaylists);
	const loadTracks = commands.registerCommand('spotify.loadTracks', actionsCreator.loadTracksForSelectedPlaylist);
	return Disposable.from(lyrics,
		next,
		previous,
		play,
		pause,
		playPause,
		muteVolume,
		unmuteVolume,
		muteUnmuteVolume,
		volumeUp,
		volumeDown,
		toggleRepeating,
		toggleShuffling,
		registration,
		signIn,
		signOut,
		loadPlaylists,
		loadTracks
	);
}