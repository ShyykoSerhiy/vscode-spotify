import { xhr } from '../request/request';
import { getLyricsServerUrl, openPanelLyrics } from '../config/spotify-config';
import { showInformationMessage } from '../info/info';
import { getState } from '../store/store';
import { Uri, TextDocumentContentProvider, EventEmitter, Event, window, workspace, ProgressLocation } from 'vscode';

let previewUri = Uri.parse('vscode-spotify://authority/vscode-spotify');
let html = '';

class TextContentProvider implements TextDocumentContentProvider {
    private _onDidChange = new EventEmitter<Uri>();

    public provideTextDocumentContent(_uri: Uri): string {
        return html;
    }

    get onDidChange(): Event<Uri> {
        return this._onDidChange.event;
    }

    public update(uri: Uri) {
        this._onDidChange.fire(uri);
    }
}

let provider = new TextContentProvider();

async function previewLyrics(lyrics: string) {
    html = lyrics.trim();
    provider.update(previewUri);
    try {
        const document = await workspace.openTextDocument(previewUri);
        await window.showTextDocument(document, openPanelLyrics(), true);
    } catch (_ignored) {
        showInformationMessage('Failed to show lyrics' + _ignored);
    }
}

export class LyricsController {
    public constructor() {
    }

    public async findLyrics() {
        window.withProgress({ location: ProgressLocation.Window, title: 'Searching for lyrics. This might take a while.' }, () => {
            return this._findLyrics();
        });
    }

    private async _findLyrics() {
        const state = getState();
        const { artist, name } = state.track;

        try {
            const result = await xhr({ url: `${getLyricsServerUrl()}?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(name)}` });
            await previewLyrics(`${result.responseText}`)
        } catch (e) {
            if (e.status === 404) {
                await previewLyrics(`Song lyrics for ${artist} - ${name} not found.\n You can add it on https://genius.com/ .`);
            }
            if (e.status === 500) {
                await previewLyrics(`Error: ${e.responseText}`);
            }
        }
    }
}

export const registration = workspace.registerTextDocumentContentProvider('vscode-spotify', provider);