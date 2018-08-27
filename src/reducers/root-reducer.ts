import { ISpotifyStatusState } from '../state/state';
import { Action, UPDATE_STATE_ACTION, SIGN_IN_ACTION } from '../actions/actions';

export function update<T>(obj: T, update: Partial<T>): T {
    return Object.assign({}, obj, update);
}

export default function (state: ISpotifyStatusState, action: Action): ISpotifyStatusState {
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
    return state;
}