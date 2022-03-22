import App from "../components/widget.svelte";
import { faMusic } from "@fortawesome/free-solid-svg-icons/faMusic";

declare const window: any;
window.marqueeExtension.defineWidget(
  {
    name: "example-widget",
    icon: faMusic,
    label: "Spotify",
    tags: ["productivity"],
    description: "Extension of VSCode Spotify",
  },
  App
);
export default App;
