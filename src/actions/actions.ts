import { ISpotifyStatusState } from '../state/state';

export const UPDATE_STATE_ACTION = 'UPDATE_STATE_ACTION' as 'UPDATE_STATE_ACTION';

export interface UpdateStateAction {
    type: typeof UPDATE_STATE_ACTION,
    state: ISpotifyStatusState
}

export function updateStateAction(state: ISpotifyStatusState): UpdateStateAction {
    return {
        type: UPDATE_STATE_ACTION,
        state
    };
}

export type Action = UpdateStateAction;