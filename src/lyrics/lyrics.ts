import { Event, EventEmitter, ProgressLocation, TextDocumentContentProvider, Uri, window, workspace } from 'vscode';

import { getLyricsServerUrl, openPanelLyrics } from '../config/spotify-config';
import { showInformationMessage } from '../info/info';
import { xhr } from '../request/request';
import { getState } from '../store/store';

class TextContentProvider implements TextDocumentContentProvider {
    htmlContent = '';

    private _onDidChange = new EventEmitter<Uri>();

    get onDidChange(): Event<Uri> {
        return this._onDidChange.event;
    }

    provideTextDocumentContent(_uri: Uri): string {
        return this.htmlContent;
    }

    update(uri: Uri) {
        this._onDidChange.fire(uri);
    }
}

export class LyricsController {
    private static lyricsContentProvider = new TextContentProvider();

    readonly registration = workspace.registerTextDocumentContentProvider('vscode-spotify', LyricsController.lyricsContentProvider);

    private readonly previewUri = Uri.parse('vscode-spotify://authority/vscode-spotify');

    async findLyrics() {
        window.withProgress({ location: ProgressLocation.Window, title: 'Searching for lyrics. This might take a while.' }, () =>
        this._findLyrics());
    }

    private async _findLyrics() {
        const state = getState();
        const { artist, name } = state.track;

        try {
            const result = await xhr({
                url: `${getLyricsServerUrl()}?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(name)}`
            });
            await this._previewLyrics(`${artist} - ${name}\n\n${result.responseText.trim()}`);
        } catch (e) {
            if (e.status === 404) {
                await this._previewLyrics(`Song lyrics for ${artist} - ${name} not found.\nYou can add it on https://genius.com/ .`);
            }
            if (e.status === 500) {
                await this._previewLyrics(`Error: ${e.responseText}`);
            }
        }
    }

    private async _previewLyrics(lyrics: string) {
        LyricsController.lyricsContentProvider.htmlContent = lyrics;
        LyricsController.lyricsContentProvider.update(this.previewUri);

        try {
            const document = await workspace.openTextDocument(this.previewUri);
            await window.showTextDocument(document, openPanelLyrics(), true);
        } catch (_ignored) {
            showInformationMessage('Failed to show lyrics' + _ignored);
        }
    }
}
