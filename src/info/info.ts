import { window } from 'vscode';

export function showInformationMessage(message: string) {
    return window.showInformationMessage(`vscode-spotify: ${message}`);
}