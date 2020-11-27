import * as path from 'path';
import * as vscode from 'vscode';

import { actionsCreator } from '../actions/actions';
import { isAlbum } from '../isAlbum';
import { Album } from '../state/state';
import { getState, getStore } from '../store/store';

export const connectAlbumTreeView = (view: vscode.TreeView<Album>) =>
    vscode.Disposable.from(
        view.onDidChangeSelection(e => {
            actionsCreator.selectAlbumAction(e.selection[0]);
            actionsCreator.loadTracksIfNotLoaded(e.selection[0]);
        }),
        view.onDidChangeVisibility(e => {
            if (e.visible) {
                const state = getState();
                if (!state.albums.length) {
                    actionsCreator.loadAlbums();
                }

                const playlistOrAlbum = state.selectedList;
                if (playlistOrAlbum && isAlbum(playlistOrAlbum)) {
                    const p = state.albums.find(({album}) => album.id === playlistOrAlbum.album.id);
                    if (p && !view.selection.indexOf(p)) {
                        view.reveal(p, { focus: true, select: true });
                    }
                }
            }
        })
    );

export class TreeAlbumProvider implements vscode.TreeDataProvider<Album> {
    readonly onDidChangeTreeDataEmitter: vscode.EventEmitter<Album | undefined> = new vscode.EventEmitter<Album | undefined>();
    readonly onDidChangeTreeData: vscode.Event<Album | undefined> = this.onDidChangeTreeDataEmitter.event;

    private albums: Album[] = [];

    constructor() {
        getStore().subscribe(() => {
            const { albums } = getState();

            if (this.albums !== albums) {
                this.albums = albums;
                this.refresh();
            }
        });
    }

    getParent(_p: Album) {
        return void 0; // all albums are in root
    }

    refresh(): void {
        this.onDidChangeTreeDataEmitter.fire(void 0);
    }

    getTreeItem(p: Album): AlbumTreeItem {
        return new AlbumTreeItem(p, vscode.TreeItemCollapsibleState.None);
    }

    getChildren(element?: Album): Thenable<Album[]> {
        if (element) {
            return Promise.resolve([]);
        }
        if (!this.albums) {
            return Promise.resolve([]);
        }

        return new Promise(resolve => {
            resolve(this.albums);
        });
    }
}

class AlbumTreeItem extends vscode.TreeItem {
    // @ts-expect-error
    get tooltip(): string {
        return `${this.album.album.name} - ${this.album.album.artists.map(a => a.name).join(", ")}`;
    }

    iconPath = {
        light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'playlist.svg'),
        dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'playlist.svg')
    };
    contextValue = 'album';

    constructor(
        private readonly album: Album,
        readonly collapsibleState: vscode.TreeItemCollapsibleState,
        readonly command?: vscode.Command
    ) {
        super(album.album.name, collapsibleState);
    }
}
