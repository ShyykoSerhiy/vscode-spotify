import { workspace } from 'vscode';
import * as httpRequest from 'request-light';

export function configureHttpRequest() {
	let httpSettings = workspace.getConfiguration('http');
	httpRequest.configure(httpSettings.get<string>('proxy', ''), httpSettings.get<boolean>('proxyStrictSSL', false));
}

export function xhr(xhrOptions: httpRequest.XHROptions) {
	configureHttpRequest();
	return httpRequest.xhr(xhrOptions);
}