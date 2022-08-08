import * as Channel from "tangle/webviews";
import { faMusic } from "@fortawesome/free-solid-svg-icons/faMusic";
import { ILoginState, IPlayerState, ITrack,  } from "../state/state";
import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import type { MarqueeWindow } from "./types";

//@ts-ignore
import NextImg from "../../media/next.png";
//@ts-ignore
import PauseBtn from "../../media/pause-button.png";
//@ts-ignore
import PlayBtn from "../../media/play-buttton.png";
//@ts-ignore
import PreviousBtn from "../../media/previous.png";
//@ts-ignore
import RepeatBtn from "../../media/repeat.png";
//@ts-ignore
import ShuffleBtn from "../../media/shuffle-arrows.png";

declare const window: MarqueeWindow;

// @ts-expect-error missing "esModuleInterop" in tsconfig
const ch = new Channel<{
  track: ITrack;
  playerState: IPlayerState;
  loginState: ILoginState | null;
}>("shyykoserhiy.vscode-spotify");
const client = ch.attach(window.vscode);

// void customElements.define('vscode-spotify', VscodeSpotify); from lit docs as marquee will do that for you
class StatefulMarqueeWidget extends LitElement {
  static styles = css`
    .defaultWrapper{ 
      width:100%;   
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      filter: brightness(0.3);
      opacity: 0.5;
      overflow: hidden;
    }
    .img-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .name-wrapper {
      position: absolute;
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      transition: all 0.5s ease-in-out;
      bottom: 40px;
    }
    .name-wrapper p {
      font-size: 18px;
      color: white;
      margin: 0;
    }
    .trackArtwork {
      width: 100%;
      height: 100%;
      transition: all 0.5s ease-in-out;
      object-fit: cover;
    }
    .trackArtwork-darkened {
      width: 100%;
      height: 100%;
      transition: all 0.5s ease-in-out;
      object-fit: cover;
      filter: brightness(0.3);
    }
    .icons {
      width: 16px;
      height: 16px;
      color: white;
      filter: brightness(0) invert(1);
    }
    body.vscode-light .icons {
      filter: brightness(0);
    }
    .shuffle-repeat-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      cursor: pointer;
      justify-content: center;
      height: 45px;
    }
    #shuffleActive {
      position: absolute;
      bottom: 0;
      left: 45%;
      right: 50%;
      font-size: 25px;
      color: green;
    }
    #repeatActive {
      position: absolute;
      bottom: 0;
      left: 45%;
      font-size: 25px;
      color: green;
    }
    section {
      position: absolute;
      width: 90%;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.5s ease-in-out;
      height: 35px;
      bottom: 0;
    }
    button {
      background: none;
      cursor: pointer;
      outline: none;
      border: none;
      color: white;
      font-size: 20px;
    }
    @media screen and (max-width: 200px) {
      .icons {
        width: 10px;
        height: 10px;
      }
    }
    .lds-ellipsis div {
      position: absolute;
      top: 33px;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background: #fff;
      animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }
    .lds-ellipsis div:nth-child(1) {
      left: 8px;
      animation: lds-ellipsis1 0.6s infinite;
    }
    .lds-ellipsis div:nth-child(2) {
      left: 8px;
      animation: lds-ellipsis2 0.6s infinite;
    }
    .lds-ellipsis div:nth-child(3) {
      left: 32px;
      animation: lds-ellipsis2 0.6s infinite;
    }
    .lds-ellipsis div:nth-child(4) {
      left: 56px;
      animation: lds-ellipsis3 0.6s infinite;
    }
    @keyframes lds-ellipsis1 {
      0% {
        transform: scale(0);
      }
      100% {
        transform: scale(1);
      }
    }
    @keyframes lds-ellipsis3 {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(0);
      }
    }
    @keyframes lds-ellipsis2 {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(24px, 0);
      }
    }
  `;
  @property()
  track: ITrack | undefined;
  
  @state()
  isHoveringControls = false;

  constructor() {
    super();
    client.on("track", (track: ITrack) => {
      this.track = track;
      window.vscode.setState({ track: track });
    });

    client.on("playerState", (state: IPlayerState) => {
      if (state.state === "paused") {
        //@ts-ignore
        this.shadowRoot!.getElementById("pausePlayIcon")!.src = PlayBtn;
      } else if (state.state === "playing") {
        //@ts-ignore
        this.shadowRoot!.getElementById("pausePlayIcon")!.src = PauseBtn;
      }
      if (state.isShuffling) {
        this.shadowRoot!.getElementById("shuffleActive")!.style.display = "block";
      } else {
        this.shadowRoot!.getElementById("shuffleActive")!.style.display = "none";
      }
      if (state.isRepeating) {
        this.shadowRoot!.getElementById("repeatActive")!.style.display = "block";
      } else {
        this.shadowRoot!.getElementById("repeatActive")!.style.display = "none";
      }
    });
  }

  render() {
    if (!this.track || this.track === null) {
      return html`
        <div class="defaultWrapper">
          <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
      `;
    }
    return html`
      <div class="img-wrapper">
        <img
          id="trackArtwork"
          class="${this.isHoveringControls ? "trackArtwork-darkened" : "trackArtwork"}"
          src="${this.track.artwork_url}"
        />
        <div 
          class="name-controller-wrapper" 
          @mouseover="${() => this.isHoveringControls = true}" 
          @mouseleave="${() => this.isHoveringControls = false}"
        >
          <div class="name-wrapper">
            <p>${this.track.name}</p>
            <p>${this.track.artist}</p>
          </div>
          <section class="controller">
            <div class="shuffle-repeat-btn">
              <button
                class="shuffle"
                @click="${() =>
                  this._triggerSpotifyCommand("spotify.toggleShuffling")}"
              >
                <img src="${ShuffleBtn}" class="icons" />
              </button>
              <div id="shuffleActive">.</div>
            </div>
            <button
              class="prevBtn"
              @click="${() => this._triggerSpotifyCommand("spotify.previous")}"
            >
              <img src="${PreviousBtn}" class="icons" />
            </button>
            <button
              class="pausePlay"
              @click="${() => this._triggerSpotifyCommand("spotify.playPause")}"
            >
              <img src="${PauseBtn}" id="pausePlayIcon" class="icons" />
            </button>
            <button
              class="nextBtn"
              @click="${() => this._triggerSpotifyCommand("spotify.next")}"
            >
              <img src="${NextImg}" class="icons" />
            </button>
            <div
              class="shuffle-repeat-btn"
              @click="${() =>
                this._triggerSpotifyCommand("spotify.toggleRepeating")}"
            >
              <button class="repeat">
                <img src="${RepeatBtn}" class="icons" />
              </button>
              <div id="repeatActive">.</div>
            </div>
          </section>
        </div>
      </div>
    `;
  }

  private _triggerSpotifyCommand(command: string) {
    window.vscode.postMessage({
      west: {
        execCommands: [
          {
            command,
          },
        ],
      },
    });
  }
}

window.marqueeExtension.defineWidget(
  {
    name: "marquee-spotify",
    icon: faMusic,
    label: "Spotify",
    tags: ["productivity"],
    description: "Extension of VSCode Spotify",
  },
  StatefulMarqueeWidget
);
export default StatefulMarqueeWidget;
