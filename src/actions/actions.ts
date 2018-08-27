import { commands, Uri } from 'vscode';
import { ISpotifyStatusState } from '../state/state';
import { getStore } from '../store/store';
import { getAuthServerUrl } from '../config/spotify-config'
import { createDisposableAuthSever } from '../auth/server/local';
import { showInformationMessage } from '../info/Info';
import { getPlaylists } from '../webapi/spotify';

function bind() {
    return function (_target: any, _key: any, descriptor: PropertyDescriptor) {
        var originalMethod = descriptor.value;

        //editing the descriptor/value parameter
        descriptor.value = function (...args: any[]) {
            return originalMethod.apply(_target, args);
        }.bind(_target);

        // return edited descriptor as opposed to overwriting the descriptor
        return descriptor;
    }
}

function actionCreator() {
    return function (_target: any, _key: any, descriptor: PropertyDescriptor) {
        var originalMethod = descriptor.value;

        //editing the descriptor/value parameter
        descriptor.value = function (...args: any[]) {
            getStore().dispatch(originalMethod.apply(null, args));
        };

        // return edited descriptor as opposed to overwriting the descriptor
        return descriptor;
    }
}

export const UPDATE_STATE_ACTION = 'UPDATE_STATE_ACTION' as 'UPDATE_STATE_ACTION';
export const SIGN_IN_ACTION = 'SIGN_IN_ACTION' as 'SIGN_IN_ACTION';
export const SIGN_OUT_ACTION = 'SIGN_OUT_ACTION' as 'SIGN_OUT_ACTION';

export interface UpdateStateAction {
    type: typeof UPDATE_STATE_ACTION,
    state: Partial<ISpotifyStatusState>
}

export interface SignInAction {
    type: typeof SIGN_IN_ACTION
    accessToken: string,
    refreshToken: string
}

export interface SignOutAction {
    type: typeof SIGN_OUT_ACTION,
}

class ActionCreator {
    @actionCreator()
    @bind()
    updateStateAction(state: Partial<ISpotifyStatusState>): UpdateStateAction {
        return {
            type: UPDATE_STATE_ACTION,
            state
        };
    }

    @bind()
    actionSignIn() {
        commands.executeCommand('vscode.open', Uri.parse(`${getAuthServerUrl()}?login=true`)).then(() => {
            const { createServerPromise, dispose } = createDisposableAuthSever();
            createServerPromise.then(({ access_token, refresh_token }) => {
                this._actionSignIn(access_token, refresh_token);                
            }).catch((e) => {
                showInformationMessage(`Failed to retrieve access token : ${JSON.stringify(e)}`);
            }).then(() => {
                dispose();
            });
        });
    }

    @bind()
    loadPlaylists() {
        getPlaylists().then();
    }

    @actionCreator()
    @bind()
    private _actionSignIn(accessToken: string, refreshToken: string): SignInAction {
        return {
            accessToken,
            refreshToken,
            type: SIGN_IN_ACTION
        };
    }

    @actionCreator()
    @bind()
    actionSignOut(): SignOutAction {
        return {
            type: SIGN_OUT_ACTION
        };
    }
}

export type Action = UpdateStateAction | SignInAction | SignOutAction;

export const actionsCreator = new ActionCreator();