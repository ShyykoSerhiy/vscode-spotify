import { window, StatusBarItem, StatusBarAlignment } from 'vscode';
import { SpotifyControls } from './spotify-controls';
import { getTrackInfoFormat, getButtonPriority } from '../config/spotify-config';
import { getState, getStore } from '../store/store';
import { ITrack } from '../state/state';

export class SpotifyStatus {
    /**
     * Status bar with info from spotify
     */
    private _statusBarItem: StatusBarItem;
    private _spotifyControls: SpotifyControls;

    constructor() {
        getStore().subscribe(() => this.render());
    }

    /**
     * Updates spotify status bar inside vscode
     */
    public render() {
        const state = getState();
        // Create as needed
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left, getButtonPriority('trackInfo'));
            this._statusBarItem.show();
        }
        if (!this._spotifyControls) {
            this._spotifyControls = new SpotifyControls();
            this._spotifyControls.showVisible();
        }
        
        if (state.isRunning) {
            const { state: playing, volume, isRepeating, isShuffling } = state.playerState;
            var text = _formattedTrackInfo(state.track);
            let toRedraw = false;
            if (text !== this._statusBarItem.text) {//we need this guard to prevent flickering
                this._statusBarItem.text = text;
                toRedraw = true;
            }
            if (this._spotifyControls.updateDynamicButtons(playing === 'playing', volume === 0, isRepeating, isShuffling)) {
                toRedraw = true;
            }
            if (toRedraw) {
                this._statusBarItem.show();
                this._spotifyControls.showVisible();
            }
        } else {
            this._statusBarItem.hide();
            this._spotifyControls.hideAll();
        }
    }    
    /**
     * Disposes status bar items(if exist)
     */
    dispose() {
        if (this._statusBarItem) {
            this._statusBarItem.dispose();
        }
        if (this._spotifyControls) {
            this._spotifyControls
        }
    }
}

function _formattedTrackInfo(track: ITrack): string {
    const { album, artist, name } = track;
    const keywordsMap: { [index: string]: string } = {
        albumName: album,
        artistName: artist,
        trackName: name,
    }
    let a = getTrackInfoFormat().replace(/albumName|artistName|trackName/gi, matched => {
        return keywordsMap[matched];
    });
    return a;
}