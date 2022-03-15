import Channel from "tangle/webviews";
import { IPlayerState, ITrack } from "./state/state";
// import * as vscode from "vscode";
import { faMusic } from "@fortawesome/free-solid-svg-icons/faMusic";

declare const window: any;
// window.vscode = window.acquireVsCodeApi();
console.log("window", window);
// const vscode = acquireVsCodeApi();
// const ch = new Channel<{ counter: 0; tracks: any[] }>("stateful.marquee");
const ch = new Channel<{ track: ITrack; playerState: IPlayerState }>(
  "shyykoserhiy.vscode-spotify"
);
const client = ch.attach(window.vscode as any);

const template = document.createElement("template");
template.innerHTML = /*html*/ `
  <style>
  :host {
    margin: 10px;
    display: block;
  }
  img{
    height: 100px;
    width: 100px;
  }
  </style>
  <h1>
   VSCode Spotify 
  </h1>
  <img src='' alt='Spotify Album Art'/>
  <section>
    <button id='prevBtn'>Prev</button>
    <button id='pausePlay'>Pause</button>
    <button id='nextBtn'>Next</button>
  </section>
 
`;
// console.log("hello world");
// window.onDidReceiveMessage = (a: any) => {
//   console.log(a);
// };
// window.addEventListener("message", (a: any) => {
//   console.log(a);
// });
// access to artwork_url

export class StatefulMarqueeWidget extends HTMLElement {
  static get is() {
    return "spotify-element";
  }

  track: ITrack = {} as null;

  // track = {
  //   name: "Track name",
  //   artist: "Artist name",
  // };
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    client.on("track", (tck) => {
      this.shadowRoot!.querySelector("h1")!.textContent =
        tck.name + " - " + tck.artist;
      this.shadowRoot!.querySelector("img")!.src = tck.artwork_url;
      this.shadowRoot!.getElementById("prevBtn")!.addEventListener(
        "click",
        () => {
          // window.vscode.commands.executeCommand("spotify.previous");
          window.vscode.postMessage({
            west: {
              execCommands: [
                {
                  command: "spotify.previous",
                },
              ],
            },
          });
        }
      );
      this.shadowRoot!.getElementById("nextBtn")!.addEventListener(
        "click",
        () => {
          // window.vscode.commands.executeCommand("spotify.previous");
          window.vscode.postMessage({
            west: {
              execCommands: [
                {
                  command: "spotify.next",
                },
              ],
            },
          });
        }
      );
      // console.log(tck);
      // this.track = tck;
    });
    client.on("playerState", (state) => {
      if (state.state === "paused") {
        this.shadowRoot!.getElementById("pausePlay")!.textContent = "Play";
        this.shadowRoot!.getElementById("pausePlay")!.addEventListener(
          "click",
          () => {
            // window.vscode.commands.executeCommand("spotify.previous");
            window.vscode.postMessage({
              west: {
                execCommands: [
                  {
                    command: "spotify.play",
                  },
                ],
              },
            });
          }
        );
      } else if (state.state === "playing") {
        this.shadowRoot!.getElementById("pausePlay")!.textContent = "Pause";
        this.shadowRoot!.getElementById("pausePlay")!.addEventListener(
          "click",
          () => {
            // window.vscode.commands.executeCommand("spotify.previous");
            window.vscode.postMessage({
              west: {
                execCommands: [
                  {
                    command: "spotify.pause",
                  },
                ],
              },
            });
          }
        );
      }
    });
    // console.log("track", this.track);
  }

  connectedCallback() {
    this.shadowRoot?.appendChild(template.content.cloneNode(true));
  }
}

window.marqueeExtension.defineWidget(
  {
    name: StatefulMarqueeWidget.is,
    icon: faMusic,
    label: "Marquee Spotify",
    tags: ["productivity"],
    description: "Spotify widget",
  },
  StatefulMarqueeWidget
);
