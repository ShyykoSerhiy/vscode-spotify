import * as Channel from "tangle/webviews";
import { faMusic } from "@fortawesome/free-solid-svg-icons/faMusic";
import { ILoginState, IPlayerState, ITrack } from "../state/state";
import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import type { MarqueeWindow } from "./types";

declare const window: MarqueeWindow;

// @ts-expect-error missing "esModuleInterop" in tsconfig
const ch = new Channel<{
  track: ITrack;
  playerState: IPlayerState;
  loginState: ILoginState | null;
  isRunning: boolean;
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
      overflow: hidden;
    }
    .wrapper-message {
      width: 75%;
      text-align: center;
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
      font-size: 24px;
      font-weight: bold;
      color: white;
      margin: 0;
    }
    .trackArtwork {
      width: 100%;
      height: 100%;
      transition: all 0.5s ease-in-out;
    }
    .trackArtwork-darkened {
      width: 100%;
      height: 100%;
      transition: all 0.5s ease-in-out;
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
    .lds-ellipsis {
      display: inline-block;
      position: relative;
      width: 80px;
      height: 80px;
    }
    .lds-ellipsis div {
      position: absolute;
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
  isRunning: boolean | undefined;
  
  @state()
  isHoveringControls = false;

  constructor() {
    super();
    client.on("track", (track: ITrack) => {
      this.track = track;
    });

    client.on("isRunning", (isRunning: boolean) => {
      this.isRunning = isRunning;
    });

    client.on("playerState", (state: IPlayerState) => {
      if (state.state === "paused") {
        //@ts-ignore
        this.shadowRoot?.getElementById("pausePlayIcon")?.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="100%" viewBox="0 0 449 512" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.494 0.768586C10.635 2.85559 5.366 7.26059 1.864 13.8346C0.0599984 17.2216 0 25.0456 0 255.835V494.335L2.158 498.335C7.839 508.863 20.604 514.298 31 510.615C37.108 508.452 437.525 277.031 441.338 273.46C446.716 268.424 448.926 263.291 448.926 255.835C448.926 248.379 446.717 243.249 441.338 238.207C437.789 234.882 37.439 3.35759 31.5 1.19559C27.627 -0.213414 21.351 -0.404414 17.494 0.768586Z" fill="white"/></svg>`;
      } else if (state.state === "playing") {
        //@ts-ignore
        this.shadowRoot?.getElementById("pausePlayIcon")?.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="100%" viewBox="0 0 313 512" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M43.3305 1.30915C34.2275 3.28715 23.5735 9.27315 16.3775 16.4532C9.2415 23.5712 2.8545 35.6231 1.1235 45.2321C-0.3745 53.5441 -0.3745 458.052 1.1235 466.364C1.7115 469.628 3.9935 476.052 6.1965 480.639C15.2135 499.425 34.9255 511.715 56.1445 511.781C63.2855 511.803 75.7245 508.629 82.3795 505.087C89.8335 501.119 101.128 489.581 104.926 482.055C111.491 469.043 111.054 485.184 111.054 255.798C111.054 26.4122 111.491 42.5532 104.926 29.5412C101.128 22.0152 89.8335 10.4772 82.3795 6.50915C71.0675 0.488151 56.2125 -1.48985 43.3305 1.30915ZM242.246 1.82315C238.225 2.87615 232.6 4.98115 229.746 6.50115C222.404 10.4092 210.981 22.0142 207.307 29.2982C200.546 42.7002 201.055 24.2502 201.055 255.798C201.055 487.346 200.546 468.896 207.307 482.298C210.978 489.576 222.402 501.187 229.729 505.087C251.345 516.592 278.304 512.531 295.732 495.143C302.868 488.025 309.255 475.973 310.986 466.364C312.484 458.052 312.484 53.5441 310.986 45.2321C310.398 41.9681 308.116 35.5442 305.913 30.9572C294.587 7.36215 267.834 -4.87985 242.246 1.82315Z" fill="white"/></svg>`;
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
    if (!this.track) {
      return html`
        <div class="defaultWrapper">
          <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
      `;
    }
    if (!this.isRunning){
      return html`
        <div class="defaultWrapper">
          <div class="wrapper-message">You must have Spotify Win/Mac App installed on and running to display information. This extension requires Spotify Premium to work on Windows.</div>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="100%" viewBox="0 0 449 448" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M341.717 1.47365C336.157 4.49065 335.954 5.87565 335.954 40.8396V72.8706L333.204 73.4326C312.675 77.6306 298.928 83.1506 284.104 93.1476C268.401 103.738 265.496 107.279 189.949 207.909C148.892 262.598 115.946 305.555 112.854 308.431C106.151 314.663 99.1392 319.161 90.9132 322.504C79.9082 326.975 71.9852 327.909 45.0442 327.909C15.7892 327.909 13.3872 328.409 6.65522 335.897C0.30422 342.961 -1.44778 350.433 1.17022 359.293C2.79322 364.786 11.0772 373.07 16.5702 374.693C22.6732 376.496 68.7452 376.313 80.9542 374.438C100.044 371.505 115.99 365.344 131.39 354.952C147.574 344.032 150.131 340.92 224.732 241.409C263.49 189.709 297.508 144.992 300.328 142.037C308.83 133.128 322.272 125.152 333.204 122.53L335.954 121.871V152.44C335.954 186.19 336.152 187.408 342.126 190.498C349.344 194.231 348.155 195.2 400.173 143.19L447.954 95.4166L403.204 50.5616C378.591 25.8916 356.699 4.40165 354.554 2.80765C350.204 -0.426354 346.019 -0.860353 341.717 1.47365ZM15.9542 73.1626C11.0062 74.7976 2.66522 83.4646 1.17022 88.5246C-1.36878 97.1166 0.275221 104.721 6.10422 111.342C13.0312 119.212 13.5952 119.331 46.9542 120.003C80.1112 120.67 82.8572 121.115 96.7772 128.074C109.337 134.353 116.566 141.847 138.454 171.281C148.904 185.333 157.679 196.83 157.954 196.831C158.916 196.834 187.452 157.748 187.189 156.788C186.546 154.438 155.954 114.743 150.024 108.564C133.945 91.8106 112.738 80.0456 88.2782 74.3086C79.4802 72.2446 21.5132 71.3266 15.9542 73.1626ZM242.954 270.523C234.979 281.269 228.579 290.513 228.731 291.065C229.564 294.089 262.779 336.445 268.69 342.021C287.128 359.414 305.869 368.773 333.704 374.485L335.954 374.947L335.958 407.178C335.961 436.947 336.105 439.644 337.839 442.489C338.872 444.183 341.158 446.165 342.919 446.895C349.771 449.733 349.651 449.832 400.575 398.972L448.071 351.535L404.263 307.624C380.168 283.473 358.276 261.957 355.614 259.811C350.291 255.519 346.788 254.909 341.921 257.426C336.176 260.397 335.954 261.807 335.954 295.378V325.947L333.204 325.294C328.132 324.09 318.741 319.806 312.411 315.808C303.597 310.241 296.048 301.708 275.954 274.598C266.329 261.612 258.229 250.987 257.954 250.986C257.679 250.986 250.929 259.777 242.954 270.523Z" fill="white" />
                </svg>
              </button>
              <div id="shuffleActive">.</div>
            </div>
            <button
              class="prevBtn"
              @click="${() => this._triggerSpotifyCommand("spotify.previous")}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="100%" viewBox="0 0 488 512" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M18.517 2.29534C14.455 3.97834 11.019 6.39234 7.87901 9.76934C-0.741987 19.0403 0.0170136 -4.71869 0.0170136 256.002C0.0170136 485.214 0.0390133 487.845 2.01401 493.123C4.36901 499.419 10.027 505.491 16.728 508.914C21.134 511.165 22.637 511.361 35.517 511.361C48.13 511.361 50.04 511.125 54.796 508.975C61.778 505.82 68.547 498.286 70.531 491.462C71.852 486.915 72.003 458.241 71.775 253.826L71.517 21.3613L69.403 16.8613C66.748 11.2103 61.082 5.56634 55.117 2.62934C51.177 0.690343 48.652 0.325343 37.517 0.0873429C25.592 -0.167657 24.021 0.015343 18.517 2.29534ZM447.017 0.492343C440.173 1.63134 434.848 3.47634 428.06 7.06234C415.461 13.7183 130.543 210.523 123.507 217.43C105.336 235.268 101.117 259.068 112.351 280.361C119.452 293.82 119.526 293.875 274.349 400.399C354.24 455.367 422.478 501.636 427.849 504.479C451.968 517.245 472.467 512.64 482.155 492.278C488.313 479.336 488.02 491.164 487.982 256.523C487.944 25.0873 488.131 33.3433 482.668 21.4113C476.552 8.05134 468.112 1.79334 454.517 0.538343C451.767 0.284343 448.392 0.264343 447.017 0.492343Z" fill="white" />
              </svg>
            </button>
            <button
              class="${this.isHoveringControls ? "pausePlay-hovered" : "pausePlay-default"}"
              id="pausePlayIcon"
              @click="${() => this._triggerSpotifyCommand("spotify.playPause")}"
            >
            </button>
            <button
              class="nextBtn"
              @click="${() => this._triggerSpotifyCommand("spotify.next")}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="100%" viewBox="0 0 460 512" fill="none" class="icons-svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M16.463 1.46632C10.597 3.54932 5.546 8.13832 2.59 14.0703L0 19.2683V255.875V492.482L2.59 497.68C8.056 508.648 20.312 514.151 32 510.886C33.925 510.348 119.425 462.7 222 405.002L408.5 300.095L409 396.235C409.467 486.052 409.618 492.638 411.301 496.375C420.185 516.109 447.836 516.892 457.41 497.68L460 492.482V255.875V19.2683L457.41 14.0703C447.836 -5.14168 420.185 -4.35868 411.301 15.3753C409.618 19.1123 409.467 25.6983 409 115.515L408.5 211.655L222 106.748C119.425 49.0503 33.925 1.40232 32 0.864318C27.205 -0.474682 21.285 -0.245682 16.463 1.46632Z" fill="white" />
              </svg>
            </button>
            <div
              class="shuffle-repeat-btn"
              @click="${() =>
                this._triggerSpotifyCommand("spotify.toggleRepeating")}"
            >
              <button class="repeat">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="100%" viewBox="0 0 512 472" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M349.422 1.1099C338.616 4.8869 333.099 17.1429 337.46 27.6849C338.408 29.9779 345.014 37.4389 354.698 47.1529L370.399 62.9029L234.41 62.9059C143.85 62.9079 95.4153 63.2669 89.4223 63.9819C48.3913 68.8739 14.3593 98.7589 3.10129 139.784L0.461288 149.403L0.131288 228.903C-0.215712 312.314 -0.178712 313.13 4.19429 319.281C7.22129 323.538 16.0173 327.265 21.5633 326.64C27.6483 325.954 34.7493 321.344 37.3313 316.403C39.3883 312.469 39.4313 311.096 39.9413 232.903C40.4213 159.408 40.5983 152.988 42.2873 147.903C49.1933 127.118 64.0703 112.236 84.9223 105.254C90.1433 103.506 97.5113 103.398 230.362 103.134L370.302 102.856L353.3 120.129C338.507 135.157 336.126 138.021 334.978 142.157C333.235 148.442 334.137 154.314 337.612 159.319C343.073 167.182 353.836 170.059 362.357 165.935C364.987 164.661 378.837 151.507 401.576 128.685C438.55 91.5759 438.942 91.0899 438.894 82.4029C438.855 75.1089 435.698 71.2809 401.621 37.2039C367.029 2.6119 363.67 -0.122104 355.922 0.00389602C353.997 0.034896 351.072 0.532897 349.422 1.1099ZM484.969 146.208C480.266 147.707 474.634 153.584 473.148 158.543C472.227 161.617 471.922 181.41 471.922 238.109C471.922 309.953 471.827 313.954 469.95 321.294C464.427 342.889 448.939 359.18 426.922 366.552C421.701 368.3 414.333 368.408 281.482 368.672L141.542 368.95L158.544 351.677C173.337 336.649 175.718 333.785 176.866 329.649C181.519 312.871 165.018 298.539 149.422 305.812C146.773 307.048 133.547 319.624 110.268 343.04C73.3053 380.223 72.9023 380.724 72.9503 389.403C72.9903 396.736 76.0913 400.482 110.718 435.019C139.042 463.268 145.179 468.916 149.164 470.401C161.181 474.88 174.466 466.707 175.678 454.09C176.536 445.158 175.081 442.831 157.584 425.153L141.501 408.903H277.488C365.634 408.903 416.456 408.537 421.948 407.862C444.976 405.033 465.436 395.073 481.764 378.745C494.801 365.708 503.752 350.187 508.771 331.914L511.383 322.403L511.702 242.903C511.946 182.228 511.73 162.354 510.791 158.973C507.875 148.47 496.113 142.655 484.969 146.208Z" fill="white" />
                </svg>
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
    description: "Extension of VS Code Spotify",
  },
  StatefulMarqueeWidget
);

export default StatefulMarqueeWidget;
