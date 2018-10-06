import { Memento } from 'vscode';
import { createStore, Store } from 'redux';
import { ISpotifyStatusState, getDefaultState } from '../state/state';
import rootReducer from '../reducers/root-reducer';
import { persistStore, persistReducer, PersistConfig} from 'redux-persist';
import { createVscodeStorage, createDummyStorage } from './storage/vscode-storage';
import { Map } from 'immutable';

export type SpotifyStore = Store<ISpotifyStatusState>;

let store: SpotifyStore;

export function getStore(memento?: Memento) {
    if (!store) {
        const persistConfig: PersistConfig = {
            key: 'root',
            storage: memento ? createVscodeStorage(memento) : createDummyStorage(),
            transforms: [{
                out: (val: any, key: string) => {
                    if (key === 'tracks') {
                        return Map(val);
                    }
                    return val;
                },
                in: (val: any, _key: string) => {
                    return val;
                }
            }]
        }
        const persistedReducer = persistReducer(persistConfig, rootReducer)
        store = createStore(persistedReducer, getDefaultState());
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