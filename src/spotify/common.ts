import { ISpotifyStatusStatePartial } from '../state/state';

export type QueryStatusFunction = () => void;

export interface SpotifyClient {
    queryStatusFunc: QueryStatusFunction;
    next(): void;
    previous(): void;
    play(): void;
    pause(): void;
    playPause(): void;
    muteVolume(): void;
    unmuteVolume(): void;
    muteUnmuteVolume(): void;
    volumeUp(): void;
    volumeDown(): void;
    toggleRepeating(): void;
    toggleShuffling(): void;
    toggleLiked(): void;
    pollStatus(cb: (status: ISpotifyStatusStatePartial) => void, getInterval: () => number): { promise: Promise<void>, cancel: () => void };
}