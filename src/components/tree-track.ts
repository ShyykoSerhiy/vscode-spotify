import * as path from 'path';
import * as vscode from 'vscode';

import { actionsCreator } from '../actions/actions';
import { Playlist, Track } from '../state/state';
import { getState, getStore } from '../store/store';

const createTrackTreeItem = (t: Track, playlist: Playlist, trackIndex: number) =>
    new TrackTreeItem(t, vscode.TreeItemCollapsibleState.None, {
        command: 'spotify.playTrack',
        title: 'Play track',
        arguments: [trackIndex, playlist]
    });

export const connectTrackTreeView = (view: vscode.TreeView<Track>) =>
    vscode.Disposable.from(
        view.onDidChangeSelection(e => {
            const track = e.selection[0];
            actionsCreator.selectTrackAction(track);
        }),
        view.onDidChangeVisibility(e => {
            if (e.visible) {
                const state = getState();
                const { selectedTrack, selectedPlaylist } = state;

                if (selectedTrack && selectedPlaylist) {
                    const tracks = state.tracks.get(selectedPlaylist.id);
                    const p = tracks && tracks.find(t => t.track.id === selectedTrack.track.id);

                    if (p && !view.selection.indexOf(p)) {
                        view.reveal(p, { focus: true, select: true });
                    }
                }
            }
        })
    );

export class TreeTrackProvider implements vscode.TreeDataProvider<Track> {
    readonly onDidChangeTreeDataEmitter: vscode.EventEmitter<Track | undefined> = new vscode.EventEmitter<Track | undefined>();
    readonly onDidChangeTreeData: vscode.Event<Track | undefined> = this.onDidChangeTreeDataEmitter.event;

    private tracks: Track[] = [];
    private selectedPlaylist?: Playlist;
    private selectedTrack?: Track;
    private view!: vscode.TreeView<Track>;

    constructor() {
        getStore().subscribe(() => {
            const { tracks, selectedPlaylist, selectedTrack } = getState();
            const newTracks = tracks.get((selectedPlaylist || { id: '' }).id);
            if (this.tracks !== newTracks || this.selectedTrack !== selectedTrack) {
                if (this.selectedTrack !== selectedTrack) {
                    this.selectedTrack = selectedTrack!;

                    if (this.selectedTrack && this.view) {
                        this.view.reveal(this.selectedTrack, { focus: true, select: true });
                    }
                }
                this.selectedPlaylist = selectedPlaylist!;
                this.selectedTrack = selectedTrack!;
                this.tracks = newTracks || [];
                this.refresh();
            }
        });
    }

    bindView(view: vscode.TreeView<Track>): void {
        this.view = view;
    }

    getParent(_t: Track) {
        return void 0; // all tracks are in root
    }

    refresh(): void {
        this.onDidChangeTreeDataEmitter.fire(void 0);
    }

    getTreeItem(t: Track): TrackTreeItem {
        const { selectedPlaylist, tracks } = this;
        const index = tracks.findIndex(track =>
            t.track.id === track.track.id);
        return createTrackTreeItem(t, selectedPlaylist!, index);
    }

    getChildren(element?: Track): Thenable<Track[]> {
        if (element) {
            return Promise.resolve([]);
        }
        if (!this.tracks) {
            return Promise.resolve([]);
        }

        return new Promise(resolve => {
            resolve(this.tracks);
        });
    }
}

const getArtists = (track: Track) =>
    track.track.artists.map(a => a.name).join(', ');
class TrackTreeItem extends vscode.TreeItem {
    // @ts-ignore
    get tooltip(): string {
        return `${getArtists(this.track)} - ${this.track.track.album.name} - ${this.track.track.name}`;
    }

    iconPath = {
        light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'track.svg'),
        dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'track.svg')
    };

    contextValue = 'track';
    constructor(
        private readonly track: Track,
        readonly collapsibleState: vscode.TreeItemCollapsibleState,
        readonly command?: vscode.Command
    ) {
        super(`${getArtists(track)} - ${track.track.name}`, collapsibleState);
    }
}