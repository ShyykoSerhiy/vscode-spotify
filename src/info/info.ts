import { window } from 'vscode';

export function showInformationMessage(message: string) {
    return window.showInformationMessage(`vscode-spotify: ${message}`);
}

export function showWarningMessage(message: string) {
    return window.showWarningMessage(`vscode-spotify: ${message}`);
}