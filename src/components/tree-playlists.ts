import * as path from 'path';
import * as vscode from 'vscode';

import { actionsCreator } from '../actions/actions';
import { isAlbum } from '../isAlbum';
import { Playlist } from '../state/state';
import { getState, getStore } from '../store/store';

export const connectPlaylistTreeView = (view: vscode.TreeView<Playlist>) =>
    vscode.Disposable.from(
        view.onDidChangeSelection(e => {
            actionsCreator.selectPlaylistAction(e.selection[0]);
            actionsCreator.loadTracksIfNotLoaded(e.selection[0]);
        }),
        view.onDidChangeVisibility(e => {
            if (e.visible) {
                const state = getState();
                if (!state.playlists.length) {
                    actionsCreator.loadPlaylists();
                }

                const playlistOrAlbum = state.selectedList;
                if (playlistOrAlbum && !isAlbum(playlistOrAlbum)) {
                    const p = state.playlists.find(pl => pl.id === playlistOrAlbum.id);
                    if (p && !view.selection.indexOf(p)) {
                        view.reveal(p, { focus: true, select: true });
                    }
                }
            }
        })
    );

export class TreePlaylistProvider implements vscode.TreeDataProvider<Playlist> {
    readonly onDidChangeTreeDataEmitter: vscode.EventEmitter<Playlist | undefined> = new vscode.EventEmitter<Playlist | undefined>();
    readonly onDidChangeTreeData: vscode.Event<Playlist | undefined> = this.onDidChangeTreeDataEmitter.event;

    private playlists: Playlist[] = [];

    constructor() {
        getStore().subscribe(() => {
            const { playlists } = getState();

            if (this.playlists !== playlists) {
                this.playlists = playlists;
                this.refresh();
            }
        });
    }

    getParent(_p: Playlist) {
        return void 0; // all playlists are in root
    }

    refresh(): void {
        this.onDidChangeTreeDataEmitter.fire(void 0);
    }

    getTreeItem(p: Playlist): PlaylistTreeItem {
        return new PlaylistTreeItem(p, vscode.TreeItemCollapsibleState.None);
    }

    getChildren(element?: Playlist): Thenable<Playlist[]> {
        if (element) {
            return Promise.resolve([]);
        }
        if (!this.playlists) {
            return Promise.resolve([]);
        }

        return new Promise(resolve => {
            resolve(this.playlists);
        });
    }
}

class PlaylistTreeItem extends vscode.TreeItem {
    // @ts-expect-error
    get tooltip(): string {
        return `${this.playlist.name} by ${this.playlist.owner.display_name}`;
    }

    iconPath = {
        light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'playlist.svg'),
        dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'playlist.svg')
    };
    contextValue = 'playlist';

    constructor(
        private readonly playlist: Playlist,
        readonly collapsibleState: vscode.TreeItemCollapsibleState,
        readonly command?: vscode.Command
    ) {
        super(playlist.name, collapsibleState);
    }
}
