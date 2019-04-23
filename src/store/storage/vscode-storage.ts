import { Memento } from 'vscode';

export function createVscodeStorage(memento: Memento) {
    return {
        getItem: (key: string): Promise<string> =>
            new Promise((resolve, _reject) => {
                resolve(memento.get(key));
            }),
        setItem: (key: string, item: string): Promise<void> =>
            new Promise((resolve, _reject) => {
                memento.update(key, item).then(resolve);
            }),
        removeItem: (key: string): Promise<void> =>
            new Promise((resolve, _reject) => {
                memento.update(key, null).then(resolve);
            })
    };
}

export function createDummyStorage() {
    return {
        getItem: (_key: string): Promise<string> =>
            new Promise((resolve, _reject) => {
                resolve('');
            }),
        setItem: (_key: string, _item: string): Promise<void> =>
            new Promise((resolve, _reject) => {
                resolve();
            }),
        removeItem: (_key: string): Promise<void> =>
            new Promise((resolve, _reject) => {
                resolve();
            })
    };
}