import * as httpRequest from 'request-light';
import { workspace } from 'vscode';

export function configureHttpRequest() {
	const httpSettings = workspace.getConfiguration('http');
	httpRequest.configure(httpSettings.get<string>('proxy', ''), httpSettings.get<boolean>('proxyStrictSSL', false));
}

export function xhr(xhrOptions: httpRequest.XHROptions) {
	configureHttpRequest();
	return httpRequest.xhr(xhrOptions);
}