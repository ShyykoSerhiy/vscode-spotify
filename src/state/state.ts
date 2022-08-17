import { Playlist, Track, Album } from '@vscodespotify/spotify-common/lib/spotify/consts';
import { Map } from 'immutable';

export { Playlist, Track, Album };

export interface ITrack {
    album: string;
    artist: string;
    name: string;
    artwork_url?: string;
}

export interface ILoginState {
    accessToken: string;
    refreshToken: string;
}

export interface IPlayerState {
    /**
     *
     */
    volume: number;
    position: number;
    state: 'playing' | 'paused';
    /**
    * true if repeating is enabled
    */
    isRepeating: boolean;
    /**
     * true if shuffling is enabled
     */
    isShuffling: boolean;
}

export interface ISpotifyStatusStatePartial {
    /**
     * true if spotify is open
     */
    isRunning: boolean;
    /**
     * additional state
     */
    playerState: IPlayerState;
    /**
     * current track
     */
    track: ITrack;
    /**
     * current context
     */
    context?: {
        /**
         * uri for the current track
         */
        uri?: string,
        /**
         * Track number in current context
         */
        trackNumber?: number
    };
}

export interface ISpotifyStatusState extends ISpotifyStatusStatePartial {
    loginState: ILoginState | null;
    playlists: Playlist[];
    albums: Album[];
    selectedList?: Playlist | Album;
    /**
     * Map<Playlist.id | Album.album.id>
     */
    tracks: Map<Playlist['id'], Track[]>;
    selectedTrack: Track | null;
}

export const DUMMY_PLAYLIST: Playlist = {
    collaborative: false,
    /* eslint-disable @typescript-eslint/naming-convention */
    external_urls: {
        spotify: ''
    },
    href: '',
    id: 'No Playlists',
    images: [{
        height: 100,
        url: 'none',
        width: 100
    }],
    name: 'It seems that you don\'t have any playlists. To refresh use spotify.loadPlaylists command.',
    owner: {
        /* eslint-disable @typescript-eslint/naming-convention */
        display_name: '',
        /* eslint-disable @typescript-eslint/naming-convention */
        external_urls: {
            spotify: ''
        },
        href: '',
        id: '',
        type: '',
        uri: ''
    },
    primary_color: null,
    public: false,
    snapshot_id: '',
    tracks: {
        href: '',
        total: 0
    },
    type: '',
    uri: ''
};

export const DEFAULT_STATE: ISpotifyStatusState = {
    playerState: {
        position: 0,
        volume: 0,
        state: 'paused',
        isRepeating: false,
        isShuffling: false
    },
    track: {
        album: '',
        artist: '',
        name: '',
        artwork_url: ''
    },
    isRunning: false,
    loginState: null,
    context: void 0,
    playlists: [],
    albums: [],
    selectedList: undefined,
    tracks: Map(),
    selectedTrack: null
};
