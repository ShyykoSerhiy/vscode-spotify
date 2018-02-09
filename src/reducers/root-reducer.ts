import { ISpotifyStatusState } from '../state/state';
import { Action, UPDATE_STATE_ACTION } from '../actions/actions';

export default function (state: ISpotifyStatusState, action: Action): ISpotifyStatusState {
    if (action.type === UPDATE_STATE_ACTION) {
        return action.state;
    }
    return state;
}