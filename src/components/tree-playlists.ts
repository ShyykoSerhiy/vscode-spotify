import * as vscode from 'vscode';
import * as path from 'path';
import { getStore, getState } from '../store/store';
import { Playlist } from '../state/state';
import { actionsCreator } from '../actions/actions';

const createPlaylistTreeItem = (p: Playlist) => {
	return new PlaylistTreeItem(p, vscode.TreeItemCollapsibleState.None);
}

export const connectPlaylistTreeView = (view: vscode.TreeView<Playlist>) => {
	return vscode.Disposable.from(
		view.onDidChangeSelection((e) => {
			actionsCreator.selectPlaylistAction(e.selection[0]);
			actionsCreator.loadTracksIfNotLoaded(e.selection[0]);
		}),
		view.onDidChangeVisibility((e) => {
			if (e.visible) {
				const state = getState();
				if (!state.playlists.length) {
					actionsCreator.loadPlaylists();
				}

				if (state.selectedPlaylist) {
					const p = state.playlists.find((pl) => pl.id === state.selectedPlaylist!.id);
					p && !~view.selection.indexOf(p) && view.reveal(p, { focus: true, select: true });
				}
			}
		})
	);
}

export class TreePlaylistProvider implements vscode.TreeDataProvider<Playlist> {
	private _onDidChangeTreeData: vscode.EventEmitter<Playlist | undefined> = new vscode.EventEmitter<Playlist | undefined>();
	readonly onDidChangeTreeData: vscode.Event<Playlist | undefined> = this._onDidChangeTreeData.event;

	private playlists: Playlist[];

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
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(p: Playlist): PlaylistTreeItem {
		return createPlaylistTreeItem(p);
	}

	getChildren(element?: Playlist): Thenable<Playlist[]> {
		if (element) {
			return Promise.resolve([]);;
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
	constructor(
		private readonly playlist: Playlist,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(playlist.name, collapsibleState);
	}

	get tooltip(): string {
		return `${this.playlist.id}:${this.label}`
	}

	iconPath = {
		light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'playlist.svg'),
		dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'playlist.svg')
	};

	contextValue = 'playlist';
}