export interface ITrack {
    album: string,
    artist: string,
    name: string
}

export interface ILoginState {
    accessToken: string,
    refreshToken: string
}

export interface IPlayerState {
    /**
     * 
     */
    volume: number,
    position: number,
    state: 'playing' | 'paused',
    /**
 * true if repeating is enabled
 */
    isRepeating: boolean,
    /**
     * true if shuffling is enabled
     */
    isShuffling: boolean    
}

export interface ISpotifyStatusStatePartial {
    /**
     * true if spotify is open
     */
    isRunning: boolean,
    /**
     * additional state
     */
    playerState: IPlayerState,
    /**
     * current track
     */
    track: ITrack
}

export interface ISpotifyStatusState extends ISpotifyStatusStatePartial {    
    loginState: ILoginState | null,
}

export const defaultState: ISpotifyStatusState = {
    playerState: {
        position: 0,
        volume: 0,
        state: 'paused',
        isRepeating: false,
        isShuffling: false,
    },
    track: {
        album: '',
        artist: '',
        name: ''
    },
    isRunning: false,
    loginState: null
} 