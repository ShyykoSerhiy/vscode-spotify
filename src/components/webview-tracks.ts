import * as path from "path";
import * as vscode from "vscode";
import Channel from "tangle/webviews";
import { faMusic } from "@fortawesome/free-solid-svg-icons/faMusic";

import { actionsCreator } from "../actions/actions";
import { isAlbum } from "../isAlbum";
import { Album, IPlayerState, ITrack, Playlist, Track } from "../state/state";
import { getState, getStore } from "../store/store";
import { Button, SpotifyControls } from "./spotify-controls";
// const createTrackWebviewItem = (
//   t: Track,
//   playlistOrAlbum: Playlist | Album,
//   trackIndex: number
// ) =>
//   new TrackTreeItem(t, vscode.TreeItemCollapsibleState.None, {
//     command: "spotify.playTrack",
//     title: "Play track",
//     arguments: [trackIndex, playlistOrAlbum],
//   });

export const connectTrackWebview = (view: vscode.TreeView<Track>) =>
  vscode.Disposable.from(
    view.onDidChangeSelection((e) => {
      const track = e.selection[0];
      actionsCreator.selectTrackAction(track);
    }),
    view.onDidChangeVisibility((e) => {
      if (e.visible) {
        const state = getState();
        const { selectedTrack, selectedList } = state;

        if (selectedTrack && selectedList) {
          const tracks = state.tracks.get(
            isAlbum(selectedList) ? selectedList.album.id : selectedList.id
          );
          const p = tracks?.find((t) => t.track.id === selectedTrack.track.id);

          if (p && !view.selection.indexOf(p)) {
            view.reveal(p, { focus: true, select: true });
          }
        }
      }
    })
  );

// export class WebviewTrackProvider implements vscode.TreeDataProvider<Track> {
//   readonly onDidChangeTreeDataEmitter: vscode.EventEmitter<Track | undefined> =
//     new vscode.EventEmitter<Track | undefined>();
//   readonly onDidChangeTreeData: vscode.Event<Track | undefined> =
//     this.onDidChangeTreeDataEmitter.event;

//   public tracks: Track[] = [];
//   private selectedList?: Playlist | Album;
//   private selectedTrack?: Track;
//   private view!: vscode.TreeView<Track>;

//   constructor() {
//     getStore().subscribe(() => {
//       const { tracks, selectedList, selectedTrack } = getState();
//       const newTracks = tracks.get(
//         (isAlbum(selectedList) ? selectedList?.album.id : selectedList?.id) ||
//           ""
//       );
//       if (this.tracks !== newTracks || this.selectedTrack !== selectedTrack) {
//         if (this.selectedTrack !== selectedTrack) {
//           this.selectedTrack = selectedTrack!;

//           if (this.selectedTrack && this.view) {
//             this.view.reveal(this.selectedTrack, { focus: true, select: true });
//           }
//         }
//         this.selectedList = selectedList!;
//         this.selectedTrack = selectedTrack!;
//         this.tracks = newTracks || [];
//         this.refresh();
//       }
//     });
//   }

//   bindView(view: vscode.TreeView<Track>): void {
//     this.view = view;
//   }

//   getParent(_t: Track) {
//     return void 0; // all tracks are in root
//   }

//   refresh(): void {
//     this.onDidChangeTreeDataEmitter.fire(void 0);
//   }

//   getTreeItem(t: Track): TrackTreeItem {
//     const { selectedList, tracks } = this;
//     const index = tracks.findIndex((track) => t.track.id === track.track.id);
//     return createTrackWebviewItem(t, selectedList!, index);
//   }

//   getChildren(element?: Track): Thenable<Track[]> {
//     if (element) {
//       return Promise.resolve([]);
//     }
//     if (!this.tracks) {
//       return Promise.resolve([]);
//     }

//     return new Promise((resolve) => {
//       resolve(this.tracks);
//     });
//   }
// }

const getArtists = (track: Track) =>
  track.track.artists.map((a) => a.name).join(", ");
function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
  return {
    // Enable javascript in the webview
    enableScripts: true,

    // And restrict the webview to only loading content from our extension's `media` directory.
    localResourceRoots: [vscode.Uri.joinPath(extensionUri, "out/compiled")],
  };
}
export class SpotifyWebview {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  private _spotifyControls: SpotifyControls | undefined;
  public static currentPanel: SpotifyWebview | undefined;

  public static readonly viewType = "Time Tracker";

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  //spotify track stuff
  public tracks: Track[] = [];
  private selectedList?: Playlist | Album;
  private selectedTrack?: Track;
  private view!: vscode.Webview;

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If we already have a panel, show it.
    if (SpotifyWebview.currentPanel) {
      SpotifyWebview.currentPanel._panel.reveal(column);
      return;
    }

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      SpotifyWebview.viewType,
      "Spotify Controller",
      column || vscode.ViewColumn.One,
      { ...getWebviewOptions(extensionUri), retainContextWhenHidden: true }
    );

    SpotifyWebview.currentPanel = new SpotifyWebview(panel, extensionUri);
  }

  public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    SpotifyWebview.currentPanel = new SpotifyWebview(panel, extensionUri);
  }

  constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    if (!this._spotifyControls) {
      this._spotifyControls = new SpotifyControls();
    }
    // console.log("btns,", this._spotifyControls.buttons);
    // Set the webview's initial html content

    this._panel.title = "Spotify Controller";
    // this._panel.webview.html = this._getHtmlForWebview(this._panel.webview);
    getStore().subscribe(() => {
      const { tracks, selectedList, selectedTrack, playerState, track } =
        getState();

      //   console.log("track", track);

      const newTracks = tracks.get(
        (isAlbum(selectedList) ? selectedList?.album.id : selectedList?.id) ||
          ""
      );
      this._panel.webview.html = this._getHtmlForWebview(
        this._panel.webview,
        track.artist,
        track,
        playerState,
        track.artwork_url,
        this._spotifyControls.buttons
      );
      if (this.tracks !== newTracks || this.selectedTrack !== selectedTrack) {
        if (this.selectedTrack !== selectedTrack) {
          this.selectedTrack = selectedTrack!;

          if (this.selectedTrack && this.view) {
            console.log("show tracks here");
          }
        }
        this.selectedList = selectedList!;
        this.selectedTrack = selectedTrack!;
        this.tracks = newTracks || [];
        // this.refresh();
      }
    });

    this._panel.webview.onDidReceiveMessage(async (data) => {
      switch (data.command) {
        case "nextSong":
          vscode.commands.executeCommand("spotify.next");
          //   vscode.window.showErrorMessage("uyoi ");
          return;
        case "prevSong":
          vscode.commands.executeCommand("spotify.previous");
          return;
      }
    });

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programmatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // // Handle messages from the webview
    // this._panel.webview.onDidReceiveMessage(
    //   (message) => {
    //     switch (message.command) {
    //       case "alert":
    //         vscode.window.showErrorMessage(message.text);
    //         return;
    //     }
    //   },
    //   null,
    //   this._disposables
    // );
  }

  public doRefactor() {
    // Send a message to the webview webview.
    // You can send any JSON serializable data.
    this._panel.webview.postMessage({ command: "refactor" });
  }

  public dispose() {
    SpotifyWebview.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  public _getHtmlForWebview(
    webview: vscode.Webview,
    artistName?: string,
    currentTrack?: ITrack,
    playerState?: IPlayerState,
    artworkUrl?: string,
    buttons?: Button[],
    nextButton?: Button,
    prevButton?: Button
  ) {
    // Local path to main script run in the webview
    // And the uri we use to load this script in the webview
    //   const scriptUri = webview.asWebviewUri(
    //     vscode.Uri.joinPath(this._extensionUri, "out/compiled", "Pomodoro.js")
    //   );
    //   const stylesUri = webview.asWebviewUri(
    //     vscode.Uri.joinPath(this._extensionUri, "out/compiled", "Pomodoro.css")
    //   );

    // // Local path to css styles
    // const styleResetPath = vscode.Uri.joinPath(
    //   this._extensionUri,
    //   "media",
    //   "reset.css"
    // );
    // const stylesPathMainPath = vscode.Uri.joinPath(
    //   this._extensionUri,
    //   "media",
    //   "vscode.css"
    // );

    // Uri to load styles into webview
    // const stylesResetUri = webview.asWebviewUri(styleResetPath);
    // const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);

    // Use a nonce to only allow specific scripts to be run
    const nonce = getNonce();

    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <!--
          Use a content security policy to only allow loading images from https or from our extension directory,
          and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
       
      </head>
      <style>
      .flex-title-row{
          display: flex;
          flex-direction: row;
          
      }
      img{
          width: 100px;
          height:100px;
      }
      </style>
      <body>
      <div class='flex-title-row'>
        <h1 id='artist'>
            ${currentTrack.name} - ${artistName}
        </h1>
      </div>

      <img class='track_artwork' src='${artworkUrl}' alt='Artwork for the track.' width='500' height='600' />
      <button id='prevBtn' >Prev</button>
      <button id='nextBtn' >Next</button>
      </body>

        <script nonce="${nonce}" >
        const vscode = acquireVsCodeApi();
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        nextBtn.addEventListener('click', () => {
            vscode.postMessage({
                command: 'nextSong',
            
            })
        });
        prevBtn.addEventListener('click', () => {
            vscode.postMessage({
                command: 'prevSong',
            
            })
        });

        function runSpotifyControl (command) {
            switch(command){
                case 'next':
                    console.log('nexts');
                    vscode.postMessage({
                        command: 'nextSong',
                    
                    })
                    return;
                case 'prev':
                    vscode.postMessage({
                        command: 'prevSong',
                   
                    })
                    return;
                default:
                    return;
            }
        }
        
    </script>
      </html>`;
  }
}
// export const showTrack = () => {
//   let ps;
//   let tk;
//   getStore().subscribe(() => {
//     console.log("playerState", ps);
//     console.log("track", tk);
//     const { playerState, track } = getState();

//     ps = playerState;
//     tk = track;
//   });

//   return { playerState: ps, track: tk };
// };
function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
// class TrackTreeItem extends vscode.Webview {
//   // @ts-ignore
//   get tooltip(): string {
//     return `${getArtists(this.track)} - ${this.track.track.album.name} - ${
//       this.track.track.name
//     }`;
//   }

//   iconPath = {
//     light: path.join(
//       __filename,
//       "..",
//       "..",
//       "..",
//       "resources",
//       "light",
//       "track.svg"
//     ),
//     dark: path.join(
//       __filename,
//       "..",
//       "..",
//       "..",
//       "resources",
//       "dark",
//       "track.svg"
//     ),
//   };

//   contextValue = "track";
//   constructor(
//     private readonly track: Track,
//     readonly collapsibleState: vscode.TreeItemCollapsibleState,
//     readonly command?: vscode.Command
//   ) {
//     super(`${getArtists(track)} - ${track.track.name}`, collapsibleState);
//   }
// }

// <link href="${stylesUri}" rel="stylesheet">
// <script src="${scriptUri}" nonce="${nonce}">
//    <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
