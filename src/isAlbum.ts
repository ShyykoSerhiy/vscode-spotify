import { Album, Playlist } from "./state/state";

export const isAlbum = (list?: Playlist | Album): list is Album => {
  return !!list && ("album" in list);
};
