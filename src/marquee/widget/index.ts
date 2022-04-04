import App from "./widget.svelte";
import { faMusic } from "@fortawesome/free-solid-svg-icons/faMusic";

declare const window: any;
window.marqueeExtension.defineWidget(
  {
    name: "spotify-widget",
    icon: faMusic,
    label: "Spotify",
    tags: ["productivity"],
    description: "Widget Extension for VSCode Spotify",
  },
  App
);
export default App;
