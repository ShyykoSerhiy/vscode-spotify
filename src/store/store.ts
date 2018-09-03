import { Memento } from 'vscode';
import { createStore, Store } from 'redux';
import { ISpotifyStatusState, defaultState } from '../state/state';
import rootReducer from '../reducers/root-reducer';
import { persistStore, persistReducer } from 'redux-persist';
import { createVscodeStorage, createDummyStorage } from './storage/vscode-storage';

export type SpotifyStore = Store<ISpotifyStatusState>;

let store: SpotifyStore;

export function getStore(memento?: Memento) {
    if (!store) {
        const persistConfig = {
            key: 'root',
            storage: memento ? createVscodeStorage(memento) : createDummyStorage()
        }
        const persistedReducer = persistReducer(persistConfig, rootReducer)
        store = createStore(persistedReducer, defaultState);
        persistStore(store);
    }
    return store;
}

export function getState() {
    return getStore().getState();
}

/**
 * True if on last state of Spotify it was muted(volume was equal 0)
 */
export function isMuted() {
    const state = getState();
    return state && state.playerState.volume === 0;
}