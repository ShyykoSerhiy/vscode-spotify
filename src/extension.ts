import { ExtensionContext, window } from 'vscode';
import { createCommands } from './commands';
import { SpotifyStatus } from './components/spotify-status';
import { SpotifyStatusController } from './spotify-status-controller';
import { registerGlobalState } from './config/spotify-config';
import { getStore } from './store/store';
import { TreePlaylistProvider, connectPlaylistTreeView } from './components/tree-playlists';
import { TreeTrackProvider, connectTrackTreeView } from './components/tree-track';

// This method is called when your extension is activated. Activation is
// controlled by the activation events defined in package.json.
export function activate(context: ExtensionContext) {
    // This line of code will only be executed once when your extension is activated.        
    registerGlobalState(context.globalState);
    getStore(context.globalState);
    const spotifyStatus = new SpotifyStatus();
    const controller = new SpotifyStatusController();
    const playlistTreeView = window.createTreeView('vscode-spotify-playlists', { treeDataProvider: new TreePlaylistProvider() });
    const trackTreeView = window.createTreeView('vscode-spotify-tracks', { treeDataProvider: new TreeTrackProvider() });
    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(connectPlaylistTreeView(playlistTreeView));
    context.subscriptions.push(connectTrackTreeView(trackTreeView));
    context.subscriptions.push(controller);
    context.subscriptions.push(spotifyStatus);
    context.subscriptions.push(playlistTreeView);
    context.subscriptions.push(createCommands());
}
