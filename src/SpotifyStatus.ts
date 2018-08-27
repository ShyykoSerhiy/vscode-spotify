import { window, StatusBarItem, StatusBarAlignment } from 'vscode';
import { SpotifyControls } from './SpotifyControls';
import { getTrackInfoFormat, getButtonPriority } from './config/SpotifyConfig';

export interface Track {
    album: string,
    artist: string,
    name: string
}

export interface State {
    volume: number,
    position: number,
    state: 'playing' | 'paused'
}

export interface SpotifyStatusState {
    /**
     * true if spotify is open
     */
    isRunning: boolean,
    state: State,
    track: Track,
    isRepeating: boolean,
    isShuffling: boolean
}

export class SpotifyStatus {
    /**
     * Status bar with info from spotify
     */
    private _statusBarItem: StatusBarItem;
    private _spotifyControls: SpotifyControls;
    /**
     * 'Current'(last retrieved) state of spotify.
     */
    private _state: SpotifyStatusState;
    private _hidden: boolean;

    /**
     * Sets state of spotify. Trigers 'updateSpotifyStatus' method.
     */
    set state(state: SpotifyStatusState) {
        this._state = state;
        this.updateSpotifyStatus();
    }

    get state(): SpotifyStatusState {
        return this._state;
    }

    /**
     * Updates spotify status bar inside vscode
     */
    public updateSpotifyStatus() {
        // Create as needed
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left, getButtonPriority('trackInfo'));
            this._statusBarItem.show();
        }
        if (!this._spotifyControls) {
            this._spotifyControls = new SpotifyControls();
            this._spotifyControls.showVisible();
        }

        if (this._state.isRunning) {
            const { isRepeating, isShuffling } = this._state;
            const { state: playing, volume } = this._state.state;
            var text = _formattedTrackInfo(this._state.track);
            if (text !== this._statusBarItem.text) {//we need this guard to prevent flickering
                this._statusBarItem.text = text;
                this.redraw();//we need to redraw due to a bug with priority
            }
            if (this._spotifyControls.updateDynamicButtons(playing === 'playing', volume === 0, isRepeating, isShuffling)) {
                this.redraw();//we need to redraw due to a bug with priority
            }
            if (this._hidden) {
                this.redraw();
            }
        } else {
            this.redraw();
        }
    }
    redraw() {
        if (this._state.isRunning) {
            this._statusBarItem.show();
            this._spotifyControls.showVisible();
            this._hidden = false;
        } else {
            this._statusBarItem.hide();
            this._spotifyControls.hideAll();
            this._hidden = true;
        }
    }
    /**
     * True if on last state of Spotify it was muted(volume was equal 0)
     */
    isMuted() {
        return this.state && this.state.state.volume === 0;
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

function _formattedTrackInfo(track: Track): string {
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