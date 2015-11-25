import {window, StatusBarItem, StatusBarAlignment} from 'vscode';
import * as spotify from 'spotify-node-applescript';

export interface SpotifyStatusState {
    isRunning: boolean,
    state: spotify.State,
    track: spotify.Track
}

export class SpotifyStatus {
    /**
     * Status bar with info from spotify
     */
    private _statusBarItem: StatusBarItem;
    /**
     * 'Current'(last retrieved) state of spotify. 
     */
    private _state: SpotifyStatusState;

    /**
     * Sets state of spotify. Trigers 'updateSpotifyStatus' method.
     */
    set state(state: SpotifyStatusState) {
        this._state = state;
        this.updateSpotifyStatus();
    }

    /**
     * Updates spotify status bar inside vscode
     */
    public updateSpotifyStatus() {
        // Create as needed 
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
        }

        var text = '';
        if (this._state.isRunning) {
            const {artist, name} = this._state.track;
            const {state: playing, volume} = this._state.state;
            const playPauseIcon = playing === 'playing' ? '$(triangle-right)' : '$(primitive-square)';
            const volumeIcon = volume === 0 ? '$(mute)' : '$(unmute)';
            this._statusBarItem.text = `${playPauseIcon} ${artist} - ${name} ${volumeIcon}`;
            this._statusBarItem.show();
        } else {
            this._statusBarItem.hide();
        }
    }

    dispose() {
        this._statusBarItem.dispose();
    }
}