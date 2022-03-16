import Channel from "tangle/webviews";
import { ILoginState, IPlayerState, ITrack } from "./state/state";
import { faMusic } from "@fortawesome/free-solid-svg-icons/faMusic";

declare const window: any;

const ch = new Channel<{
  track: ITrack;
  playerState: IPlayerState;
  loginState: ILoginState;
}>("shyykoserhiy.vscode-spotify");
const client = ch.attach(window.vscode as any);
// if needing login state - <button id='login-logout-btn'> <i class='fa fa-sign-out'></i>Login</button>
const template = document.createElement("template");
template.innerHTML = /*html*/ `
  <style>
  :host {
    margin: 10px;
    display: block;
  }
  img{
    height: 150px;
    width: 150px;
    margin-right: 15px;
    border-radius:10px;
  }
  h1{
    font-size: 16px;
  }
  #flex{
    padding: 10px;
    display:flex;
    flex-direction: column;
    align-items:center;
    justify-content: center;
    position: relative;
  }
  button{
    background: none;
    cursor:pointer;
    outline:none;
    border:none;
    color:white;
    font-size:20px;
  }
  section{
    width:100%;
    display: flex;
    justify-content:center;
    align-items:center;
    margin-top:10px;
    height:35px;
  }
  #shuffle-repeat-btn{
    display:flex;
    flex-direction:column;
    align-items:center;
    position: relative;
    cursor:pointer;
    justify-content:center;
    height:45px;
  }
  #shuffleActive{
    position: absolute;
    bottom: 0;
    left: 45%;
    right: 50%;
    font-size:25px;
    color:green
  }
  #repeatActive{
    position: absolute;
    bottom: 0;
    left: 45%;
    font-size:25px;
    color:green
  }
 
  #login-logout-btn{
    position: absolute;
    top:0;
    right:0;
    font-size:12px;
  }


  </style>

  <div id='flex'>
  
  <h1>
  VSCode Spotify 
  </h1>
  <img src='' alt='Spotify Album Art'/>
  <div>
  <section>
  <div id='shuffle-repeat-btn'>
    <button id='shuffle'>🔀</button>
    <div id='shuffleActive'>.</div>

  </div>
  <button id='prevBtn'>⏮️</button>
  <button id='pausePlay'>Pause</button>
  <button id='nextBtn'>⏭️</button>
  <div id='shuffle-repeat-btn'>
    <button id='repeat'>🔁</button>
    <div id='repeatActive'>.</div>
 
  </div>
  </section>
  </div>
 </div>
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
  isLoggedIn: boolean;
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    // hard to run dev on login state but this is how it would be:
    // client.on("loginState", (l) => {
    //   if (l === null) {
    //     this.isLoggedIn = false;
    //     this.shadowRoot!.getElementById("login-logout-btn")!.innerText =
    //       "Login";
    //     this.shadowRoot!.getElementById("login-logout-btn")!.addEventListener(
    //       "click",
    //       () => {
    //         window.vscode.postMessage({
    //           west: {
    //             execCommands: [
    //               {
    //                 command: "spotify.signIn",
    //               },
    //             ],
    //           },
    //         });
    //       }
    //     );
    //   } else {
    //     this.isLoggedIn = true;
    //     this.shadowRoot!.getElementById("login-logout-btn")!.innerText =
    //       "Logout";
    //     this.shadowRoot!.getElementById("login-logout-btn")!.addEventListener(
    //       "click",
    //       () => {
    //         window.vscode.postMessage({
    //           west: {
    //             execCommands: [
    //               {
    //                 command: "spotify.signOut",
    //               },
    //             ],
    //           },
    //         });
    //       }
    //     );
    //   }
    // });

    client.on("track", (tck) => {
      this.shadowRoot!.querySelector("h1")!.textContent =
        tck.name + " - " + tck.artist;
      //@ts-ignore
      this.shadowRoot!.querySelector("img")!.src = tck.artwork_url;
    });

    client.on("playerState", (state) => {
      if (state.state === "paused") {
        this.shadowRoot!.getElementById("pausePlay")!.innerText = "▶️";
      } else if (state.state === "playing") {
        this.shadowRoot!.getElementById("pausePlay")!.innerText = "⏸";
      }
      if (state.isShuffling) {
        this.shadowRoot!.getElementById("shuffleActive")!.style.display =
          "block";
      } else {
        this.shadowRoot!.getElementById("shuffleActive")!.style.display =
          "none";
      }
      if (state.isRepeating) {
        this.shadowRoot!.getElementById("repeatActive")!.style.display =
          "block";
      } else {
        this.shadowRoot!.getElementById("repeatActive")!.style.display = "none";
      }
    });
  }

  connectedCallback() {
    console.log(this.isLoggedIn);

    this.shadowRoot?.appendChild(template.content.cloneNode(true));

    this.shadowRoot!.getElementById("nextBtn")!.addEventListener(
      "click",
      () => {
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
    this.shadowRoot!.getElementById("pausePlay")!.addEventListener(
      "click",
      () => {
        window.vscode.postMessage({
          west: {
            execCommands: [
              {
                command: "spotify.playPause",
              },
            ],
          },
        });
      }
    );
    this.shadowRoot!.getElementById("shuffle")!.addEventListener(
      "click",
      () => {
        window.vscode.postMessage({
          west: {
            execCommands: [
              {
                command: "spotify.toggleShuffling",
              },
            ],
          },
        });
      }
    );
    this.shadowRoot!.getElementById("repeat")!.addEventListener("click", () => {
      window.vscode.postMessage({
        west: {
          execCommands: [
            {
              command: "spotify.toggleRepeating",
            },
          ],
        },
      });
    });
  }
}

window.marqueeExtension.defineWidget(
  {
    name: StatefulMarqueeWidget.is,
    icon: faMusic,
    label: "Marquee x VSCode-Spotify",
    tags: ["productivity", "music"],
    description:
      "Controller for spotify widget extending vscode-spotify extension",
  },
  StatefulMarqueeWidget
);
