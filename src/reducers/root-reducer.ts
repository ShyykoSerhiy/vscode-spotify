import {
	Action,
	PLAYLISTS_LOAD_ACTION,
	SELECT_PLAYLIST_ACTION,
	SELECT_TRACK_ACTION,
	SIGN_IN_ACTION,
	SIGN_OUT_ACTION,
	TRACKS_LOAD_ACTION,
	UPDATE_STATE_ACTION
} from '../actions/actions';
import { log } from '../info/info';
import { DEFAULT_STATE, DUMMY_PLAYLIST, ISpotifyStatusState } from '../state/state';

export function update<T>(obj: T, propertyUpdate: Partial<T>): T {
	return Object.assign({}, obj, propertyUpdate);
}

export default function (state: ISpotifyStatusState, action: Action): ISpotifyStatusState {
	log('root-reducer', action.type, JSON.stringify(action));
	if (action.type === UPDATE_STATE_ACTION) {
		return update(state, action.state);
	}
	if (action.type === SIGN_IN_ACTION) {
		return update(state, {
			loginState: update(
				state.loginState, { accessToken: action.accessToken, refreshToken: action.refreshToken }
			)
		});
	}
	if (action.type === SIGN_OUT_ACTION) {
		return DEFAULT_STATE;
	}
	if (action.type === PLAYLISTS_LOAD_ACTION) {
		return update(state, {
			playlists: (action.playlists && action.playlists.length) ? action.playlists : [DUMMY_PLAYLIST]
		});
	}
	if (action.type === SELECT_PLAYLIST_ACTION) {
		return update(state, {
			selectedPlaylist: action.playlist
		});
	}
	if (action.type === SELECT_TRACK_ACTION) {
		return update(state, {
			selectedTrack: action.track
		});
	}
	if (action.type === TRACKS_LOAD_ACTION) {
		return update(state, {
			tracks: state.tracks.set(action.playlist.id, action.tracks)
		});
	}
	return state;
}