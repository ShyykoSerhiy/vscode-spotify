import * as moment from 'moment';
import { window } from 'vscode';

import { getEnableLogs } from '../config/spotify-config';

export function showInformationMessage(message: string) {
    window.showInformationMessage(`vscode-spotify: ${message}`);
}

export function showWarningMessage(message: string, ...items: string[]) {
    return window.showWarningMessage(`vscode-spotify: ${message}`, ...items);
}

export function showErrorMessage(message: string) {
    window.showErrorMessage(`vscode-spotify: ${message}`, );
}

export function log(...args: any[]) {
    if (getEnableLogs()) {
        console.log.apply(console, ['vscode-spotify', moment().format('YYYY/MM/DD HH:MM:mm:ss:SSS'), ...args]);
    }
}
