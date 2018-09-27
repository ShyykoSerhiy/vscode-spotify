import * as vscode from 'vscode';
import * as path from 'path';
import { getStore, getState } from '../store/store';
import { Track } from '../state/state';
import { actionsCreator } from '../actions/actions';

const createTrackTreeItem = (p: Track) => {
	return new TrackTreeItem(p, vscode.TreeItemCollapsibleState.None);
}

export const connectTrackTreeView = (view: vscode.TreeView<Track>) => {
	return vscode.Disposable.from(
		view.onDidChangeSelection((e) => {
			const track = e.selection[0];
			actionsCreator.selectTrackAction(e.selection[0]);
			const state = getState();
			const { tracks, selectedPlaylist } = state;
			if (!selectedPlaylist || !track) {
				return;
			}
			const index = (tracks.get(selectedPlaylist.id) || []).findIndex((t)=>{
				return t.track.id === track.track.id;
			});

			~index && actionsCreator.playTrack(index, getState().selectedPlaylist!);
		}),
		view.onDidChangeVisibility((e) => {
			if (e.visible) {
				const state = getState();
				const { selectedTrack, selectedPlaylist } = state;
				if (selectedTrack && selectedPlaylist) {
					const tracks = state.tracks.get(selectedPlaylist.id);
					const p = tracks && tracks.find((t) => t.track.id === selectedTrack.track.id);
					p && !~view.selection.indexOf(p) && view.reveal(p, { focus: true, select: true });
				}
			}
		})
	);
}

export class TreeTrackProvider implements vscode.TreeDataProvider<Track> {
	private _onDidChangeTreeData: vscode.EventEmitter<Track | undefined> = new vscode.EventEmitter<Track | undefined>();
	readonly onDidChangeTreeData: vscode.Event<Track | undefined> = this._onDidChangeTreeData.event;

	private tracks: Track[];

	constructor() {
		getStore().subscribe(() => {
			const { tracks, selectedPlaylist } = getState();
			const newTracks = tracks.get((selectedPlaylist || { id: '' }).id);
			if (this.tracks !== newTracks) {
				this.tracks = newTracks || [];
				this.refresh();
			}
		});
	}

	getParent(t: Track) {
		return void 0; // all tracks are in root
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(p: Track): TrackTreeItem {
		return createTrackTreeItem(p);
	}

	getChildren(element?: Track): Thenable<Track[]> {
		if (element) {
			return Promise.resolve([]);;
		}
		if (!this.tracks) {
			return Promise.resolve([]);
		}

		return new Promise(resolve => {
			resolve(this.tracks);
		});
	}
}

const getArtists = (track: Track) => {
	return track.track.artists.map((a) => a.name).join(', ');
}
class TrackTreeItem extends vscode.TreeItem {
	constructor(
		private readonly track: Track,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(`${getArtists(track)} - ${track.track.name}`, collapsibleState);
	}


	get tooltip(): string {
		return `${getArtists(this.track)} - ${this.track.track.album} - ${this.track.track.name}`
	}

	iconPath = {
		light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'track.svg'),
		dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'track.svg')
	};

	contextValue = 'track';
}