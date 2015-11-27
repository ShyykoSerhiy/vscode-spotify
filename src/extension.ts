import {ExtensionContext, commands} from 'vscode';
import {createCommands} from './Commands';
import {SpotifyStatus} from './SpotifyStatus';
import {SpotifyStatusController} from './SpotifyStatusController';

// This method is called when your extension is activated. Activation is
// controlled by the activation events defined in package.json.
export function activate(context: ExtensionContext) {    
    // This line of code will only be executed once when your extension is activated.        
    let spotifyStatus = new SpotifyStatus();
    let controller = new SpotifyStatusController(spotifyStatus);

    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(controller);
    context.subscriptions.push(spotifyStatus);
    context.subscriptions.push(createCommands(spotifyStatus, controller));
}