import Channel from "tangle/webviews";
import { faMusic } from "@fortawesome/free-solid-svg-icons/faMusic";
import { ITrack } from "./state/state";
// import type { MarqueeWindow } from "./utils/marqueeTypes";
declare const window: any;

const ch = new Channel<{ track: ITrack }>("shyykoserhiy.vscode-spotify");
const client = ch.attach(window.vscode as any);

const template = document.createElement("template");

// template.innerHTML = /*html*/ `
//   <style>
//   :host {
//     margin: 10px;
//     display: block;
//   }
//   </style>

//   <div>
//   Song: ${tomorrow}
//   </div>
// `;
template.innerHTML = /*html*/ `
  <style>
  :host {
    margin: 10px;
    display: block;
  }
  </style>
  <div>
    Hello World
  </div>
`;
class StatefulMarqueeWidget extends HTMLElement {
  static get is() {
    return "stateful-marquee-widget-2";
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // this.innerHTML = this.trackName;
    client.on("track", (cnt) => {
      console.log("track", cnt);
      // this.shadowRoot!.querySelector("div")!.innerHTML =
      //   "Hello World" + [...new Array(cnt)].map(() => "!").join("");
    });
    // client.on("counter", (cnt) => {
    //   this.shadowRoot!.querySelector("div")!.innerHTML =
    //     "Hello World" + [...new Array(cnt)].map(() => "!").join("");
    // });
    // getStore().subscribe(() => {
    //   const { tracks, selectedList, selectedTrack, playerState, track } =
    //     getState();
    //   console.log("playerState", playerState);
    //   console.log("tracks", tracks);
    //   console.log("selectedTrack", selectedTrack);
    //   console.log("track", track);
    //   console.log("selectedList", selectedList);
    //   //   console.log("track", track);
    //   // const newTracks = tracks.get(
    //   //   (isAlbum(selectedList) ? selectedList?.album.id : selectedList?.id) ||
    //   //     ""
    //   // );
    // });
  }

  connectedCallback() {
    this.shadowRoot?.appendChild(template.content.cloneNode(true));
  }
}

window.marqueeExtension.defineWidget(
  {
    name: StatefulMarqueeWidget.is,
    icon: faMusic,
    label: "Marquee Spotify Controller",
    tags: ["productivity"],
    description: "Extension of VSCode Spotify",
  },
  StatefulMarqueeWidget
);

export default StatefulMarqueeWidget;
