import Channel from "tangle/webviews";
import { faMusic } from "@fortawesome/free-solid-svg-icons/faMusic";
import { ILoginState, IPlayerState, ITrack } from "./state/state";
import { LitElement, html, css, PropertyValueMap } from "lit";
import { property } from "lit/decorators.js";
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

// you dont need to define element as the element below on name will define it for you there
class StatefulMarqueeWidget2 extends LitElement {
  static styles = css`
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
      margin-right: 15px;
      transition: all 0.5s ease-in-out;
      object-fit: cover;

      /* filter: brightness(0.5); */
    }
    .trackArtwork-darkened {
      height: 100%;
      width: 100%;
      margin-right: 15px;
      border-radius: 10px;
      transition: all 0.5s ease-in-out;
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
  `;
  @property()
  track: ITrack;
  prevTrack = window.vscode.getState().track;

  //run our updates
  constructor() {
    super();
    console.log("prevTrack", this.prevTrack);
    client.on("track", (tck) => {
      this.track = tck;
      window.vscode.setState({ track: tck });
    });

    client.on("playerState", (state) => {
      if (state.state === "paused") {
        //@ts-ignore
        this.shadowRoot!.getElementById("pausePlayIcon")!.src = PlayBtn;
      } else if (state.state === "playing") {
        //@ts-ignore
        this.shadowRoot!.getElementById("pausePlayIcon")!.src = PauseBtn;
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

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    this.shadowRoot
      .querySelector(".name-controller-wrapper")
      .addEventListener("mouseenter", () => {
        this.shadowRoot.getElementById("trackArtwork")!.style.filter =
          "brightness(0.3)";
      });
    this.shadowRoot
      .querySelector(".name-controller-wrapper")
      .addEventListener("mouseleave", () => {
        this.shadowRoot.getElementById("trackArtwork")!.style.filter =
          "brightness(1)";
      });
  }
  // connectedCallback(): void {
  //   super.connectedCallback();
  //   console.log("prev track", window.vscode.getState());
  //   this.track = window.vscode.getState().track;
  // }

  render() {
    return html`
      <div class="img-wrapper">
        <img
          id="trackArtwork"
          class="trackArtwork"
          src="${this.track.artwork_url}"
        />
        <div class="name-controller-wrapper">
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
    name: "spotify-marquee",
    icon: faMusic,
    label: "Spotify",
    tags: ["productivity"],
    description: "Extension of VSCode Spotify",
  },
  StatefulMarqueeWidget2
);
export default StatefulMarqueeWidget2;
