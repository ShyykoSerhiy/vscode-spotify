import { window } from 'vscode';
import * as moment from 'moment';
import { getEnableLogs } from '../config/spotify-config';

export function showInformationMessage(message: string) {
    return window.showInformationMessage(`vscode-spotify: ${message}`);
}

export function showWarningMessage(message: string) {
    return window.showWarningMessage(`vscode-spotify: ${message}`);
}

export const log = (...args: any[]) => {
    getEnableLogs() && console.log.apply(console, ['vscode-spotify', moment().format('YYYY/MM/DD HH:MM:mm:ss:SSS'), ...args]);
};
