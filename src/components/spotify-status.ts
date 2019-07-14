import { StatusBarAlignment, StatusBarItem, window } from 'vscode';

import { getButtonPriority, getTrackInfoClickBehaviour, getTrackInfoFormat } from '../config/spotify-config';
import { ILoginState, ITrack } from '../state/state';
import { getState, getStore } from '../store/store';

import { SpotifyControls } from './spotify-controls';

export class SpotifyStatus {
    /**
     * Status bar with info from spotify
     */
    private _statusBarItem?: StatusBarItem;
    private _spotifyControls?: SpotifyControls;
    private loginState: ILoginState | null = null;

    constructor() {
        getStore().subscribe(() => {
            this.render();
        });
    }

    /**
     * Updates spotify status bar inside vscode
     */
    render() {
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
        if (this.loginState !== state.loginState) {
            this.loginState = state.loginState;
            this._spotifyControls.showHideAuthButtons();
        }

        if (state.isRunning) {
            const { state: playing, volume, isRepeating, isShuffling } = state.playerState;
            const text = this.formattedTrackInfo(state.track);
            let toRedraw = false;
            if (text !== this._statusBarItem.text) {// we need this guard to prevent flickering
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
            const trackInfoClickBehaviour = getTrackInfoClickBehaviour();
            if (trackInfoClickBehaviour === 'none') {
                this._statusBarItem.command = undefined;
            } else {
                this._statusBarItem.command = 'spotify.trackInfoClick';
            }
        } else {
            this._statusBarItem.text = '';
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
            this._spotifyControls.dispose();
        }
    }

    private formattedTrackInfo(track: ITrack): string {
        const { album, artist, name } = track;
        const keywordsMap: { [index: string]: string } = {
            albumName: album,
            artistName: artist,
            trackName: name
        };

        return getTrackInfoFormat().replace(/albumName|artistName|trackName/gi, matched => keywordsMap[matched]);
    }
}
