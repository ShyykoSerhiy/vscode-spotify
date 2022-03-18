import Channel from "tangle/webviews";
import { ILoginState, IPlayerState, ITrack } from "./state/state";
import { faMusic } from "@fortawesome/free-solid-svg-icons/faMusic";
//@ts-ignore
import NextImg from "../media/next.png";
//@ts-ignore
import PauseBtn from "../media/pause-button.png";
//@ts-ignore
import PlayBtn from "../media/play-buttton.png";
//@ts-ignore
import PreviousBtn from "../media/previous.png";
//@ts-ignore
import RepeatBtn from "../media/repeat.png";
//@ts-ignore
import ShuffleBtn from "../media/shuffle-arrows.png";
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
  :host([layout = "large"]) p { 
   font-size:32px;

  }
  #trackArtwork{
    height: 100%;
    width: 100%;
    margin-right: 15px;
    border-radius:10px;
    transition: all 0.5s ease-in-out;
    background-image: linear-gradient(rgba(0, 0, 0, 0.5),
                       rgba(0, 0, 0, 0.5)), url("url_of_image"))
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
    position: absolute;
    width:90%;
    padding: 10px;
    display: flex;
    justify-content:space-between;
    align-items:center;
    transition: all 0.5s ease-in-out;
    height:35px;
    bottom: 0;
    visibility: hidden;
    opacity:0;
  }
  #name-wrapper{
    position: absolute;
    width:100%;
    padding: 10px;
    display: flex;
    flex-direction:column;
    justify-content:flex-start;
    visibility: hidden;
    opacity:0;
    transition: all 0.5s ease-in-out;
    bottom: 40px;
  }
  #name-wrapper p{
    font-size:18px;
    color:white;
  }
  p{
    margin:0;
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
  #img-wrapper{
    position: relative;
    width: 100%;
    height:100%;
  }

  .icons{
    width:20px;
    height:20px;
    color:white;
    filter: brightness(0) invert(1);
  }
  </style>

  <div id='flex'>
  
  <div id='img-wrapper'>
  <img src='' id='trackArtwork' alt='Spotify Album Art'/>
  
  <div id='name-wrapper'>
  <p id='trackName'>
  
  </p>
  <p id='artistName'></p>
  </div>
  
  <section id='controller'>
  <div id='shuffle-repeat-btn'>
    <button id='shuffle'>
      <img src="${ShuffleBtn}" class='icons' />
    </button>
    <div id='shuffleActive'>.</div>

  </div>
  <button id='prevBtn'>
    <img src="${PreviousBtn}" class='icons' />
  </button>
  <button id='pausePlay'>
   <img src="${PauseBtn}" id='pausePlayIcon' class='icons' />
  </button>
  <button id='nextBtn'>
  <img src="${NextImg}" class='icons' /></button>
  <div id='shuffle-repeat-btn'>
    <button id='repeat'>
     <img src="${RepeatBtn}" class='icons' />
    </button>
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
console.log("window.vscode", window.vscode.setState());
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
      this.shadowRoot!.getElementById("trackName")!.textContent = tck.name;
      this.shadowRoot!.getElementById("artistName")!.textContent = tck.artist;
      //@ts-ignore
      this.shadowRoot!.querySelector("#trackArtwork")!.src = tck.artwork_url;
    });

    client.on("playerState", (state) => {
      if (state.state === "paused") {
        this.shadowRoot!.getElementById("pausePlayIcon")!.src = PlayBtn;
      } else if (state.state === "playing") {
        this.shadowRoot!.getElementById("pausePlayIcon")!.src = PauseBtn;
        // this.shadowRoot!.getElementById("pausePlay")!.innerText = "⏸";
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
    //enable butons to show
    this.shadowRoot!.getElementById("img-wrapper")!.addEventListener(
      "mouseenter",
      () => {
        this.shadowRoot!.getElementById("trackArtwork").style.opacity = "0.35";
        this.shadowRoot!.getElementById("controller").style.visibility =
          "visible";
        this.shadowRoot!.getElementById("controller").style.opacity = "1";
        this.shadowRoot!.getElementById("name-wrapper").style.visibility =
          "visible";
        this.shadowRoot!.getElementById("name-wrapper").style.opacity = "1";
      }
    );
    //reset view
    this.shadowRoot!.getElementById("img-wrapper")!.addEventListener(
      "mouseleave",
      () => {
        //can just add a class that has these elements but it works for now...
        this.shadowRoot!.getElementById("trackArtwork").style.opacity = "1";
        this.shadowRoot!.getElementById("controller").style.display = "hidden";
        this.shadowRoot!.getElementById("controller").style.opacity = "0";
        this.shadowRoot!.getElementById("name-wrapper").style.display =
          "hidden";
        this.shadowRoot!.getElementById("name-wrapper").style.opacity = "0";
      }
    );
  }
}
console.log("StatefulMarqueeWidget", StatefulMarqueeWidget);
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
