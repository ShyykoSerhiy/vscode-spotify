import { commands, Disposable } from 'vscode';

import { actionsCreator } from './actions/actions';
import { getTrackInfoClickBehaviour } from './config/spotify-config';
import { LyricsController } from './lyrics/lyrics';
import { SpotifyClient } from './spotify/common';
import { Album, Playlist } from './state/state';
import { SIGN_IN_COMMAND } from './consts/consts';

export function createCommands(sC: SpotifyClient): { dispose: () => void } {
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
    const toggleLiked = commands.registerCommand('spotify.toggleLiked', sC.toggleLiked.bind(sC));
    const signIn = commands.registerCommand(SIGN_IN_COMMAND, actionsCreator.actionSignIn);
    const signOut = commands.registerCommand('spotify.signOut', actionsCreator.actionSignOut);
    const loadPlaylists = commands.registerCommand('spotify.loadPlaylists', actionsCreator.loadPlaylists);
    const loadAlbums = commands.registerCommand('spotify.loadAlbums', actionsCreator.loadAlbums);
    const loadTracks = commands.registerCommand('spotify.loadTracks', actionsCreator.loadTracksForSelectedPlaylist);
    const trackInfoClick = commands.registerCommand('spotify.trackInfoClick', () => {
        const trackInfoClickBehaviour = getTrackInfoClickBehaviour();
        if (trackInfoClickBehaviour === 'focus_song') {
            actionsCreator.selectCurrentTrack();
        } else if (trackInfoClickBehaviour === 'play_pause') {
            sC.playPause();
        }
    });
    const playTrack = commands.registerCommand('spotify.playTrack', async (/*arguments from TrackTreeItem event*/offset: number, list: Playlist | Album) => {
        await actionsCreator.playTrack(offset, list);
        sC.queryStatusFunc();
    });
    const seekTo = commands.registerCommand('spotify.seekTo', (seekToMs: string) => {
        actionsCreator.seekTo(seekToMs);
    });

    return Disposable.from(
        lyrics,
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
        toggleLiked,
        signIn,
        signOut,
        loadPlaylists,
        loadAlbums,
        loadTracks,
        trackInfoClick,
        playTrack,
        seekTo,
        lC.registration
    );
}
