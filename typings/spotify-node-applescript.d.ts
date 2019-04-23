declare module 'spotify-node-applescript' {
    /**
     * {
     *   artist: 'Bob Dylan',
     *   album: 'Highway 61 Revisited',
     *   disc_number: 1,
     *   duration: 370,
     *   played count: 0,
     *   track_number: 1,
     *   starred: false,
     *   popularity: 71,
     *   id: 'spotify:track:3AhXZa8sUQht0UEdBJgpGc',
     *   name: 'Like A Rolling Stone',
     *   album_artist: 'Bob Dylan',
     *   spotify_url: 'spotify:track:3AhXZa8sUQht0UEdBJgpGc' }
     *	}
     */
    export interface Track {
        artist: string;
        album: string;
        disc_number: number;
        duration: number;
        played_count: number;
        track_number: number;
        starred: boolean;
        popularity: number;
        id: string;
        name: string;
        album_artist: string;
        spotify_url: string;
    }
    /**
     * {
     *   volume: 99,
     *   position: 232,
     *   state: 'playing'
     * }
     */
    export interface State {
        volume: number;
        position: number;
        state: string;
    }

    /**
     *  Open track
     */
    export function open(uri: string, callback: () => void): void;
    /**
     * Play a track with Spotify URI uri.
     * spotify.playTrack('spotify:track:3AhXZa8sUQht0UEdBJgpGc', function(){// track is playing});
     */
    export function playTrack(uri: string, callback: () => void): void;
    /**
     * Play a track in context of for example an album.
     * playTrackInContext('spotify:track:0R8P9KfGJCDULmlEoBagcO', 'spotify:album:6ZG5lRT77aJ3btmArcykra', function(){
     * // Track is playing in context of an album
     * })
     */
    export function playTrackInContext(uri: string, contextUri: string, callback: () => void): void;
    /**
     * Get the current track. callback is called with the current track as second argument.
     */
    export function getTrack(callback: (err: any, track: Track) => void): void;
    /**
     * Get player state.
     */
    export function getState(callback: (err: any, state: State) => void): void;
    /**
     * Jump to a specific second of the current song.
     */
    export function jumpTo(second: number, callback: () => void): void;
    /**
     * Resume playing current track.
     */
    export function play(callback: () => void): void;
    /**
     * Pause playing track.
     */
    export function pause(callback: () => void): void;
    /**
     * Toggle play.
     */
    export function playPause(callback: () => void): void;
    /**
     * Play next track.
     */
    export function next(callback: () => void): void;
    /**
     * Play previous track.
     */
    export function previous(callback: () => void): void;
    /**
     * Turn volume up.
     */
    export function volumeUp(callback: () => void): void;
    /**
     * Turn volume down.
     */
    export function volumeDown(callback: () => void): void;
    /**
     * Sets the volume.
     */
    export function setVolume(volume: number, callback: () => void): void;
    /**
     * Reduces audio to 0, saving the previous volume.
     */
    export function muteVolume(callback: () => void): void;
    /**
     * Returns audio to original volume.
     */
    export function unmuteVolume(callback: () => void): void;
    /**
     * Check if Spotify is running.
     */
    export function isRunning(callback: (err: any, isRunning: boolean) => void): void;
    /**
     * Is repeating on or off?
     */
    export function isRepeating(callback: (err: any, isRepeating: boolean) => void): void;
    /**
     * Is shuffling on or off?
     */
    export function isShuffling(callback: (err: any, isShuffling: boolean) => void): void;
    /**
     * Sets repeating on or off
     */
    export function setRepeating(repeating: boolean, callback: (err: any) => void): void;
    /**
     * Sets shuffling on or off
     */
    export function setShuffling(shuffling: boolean, callback: (err: any) => void): void;
    /**
     * Toggles repeating
     */
    export function toggleRepeating(callback: (err: any) => void): void;
    /**
     * Toggles shuffling
     */
    export function toggleShuffling(callback: (err: any) => void): void;
}