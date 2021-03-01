import { Api } from '@vscodespotify/spotify-common/lib/spotify/api';
import { report } from 'superagent';

import { getSpotifyWebApi, withApi, withErrorAsync } from '../actions/actions';
import { log } from '../info/info';
import { ISpotifyStatusStatePartial } from '../state/state';
import { getState } from '../store/store';
import { artistsToArtist } from '../utils/utils';
import { QueryStatusFunction, SpotifyClient } from './common';
import { createCancelablePromise, NOT_RUNNING_REASON } from './utils';

export class WebApiSpotifyClient implements SpotifyClient {
    private prevVolume: number = 0;
    private _queryStatusFunc: QueryStatusFunction;

    constructor(_queryStatusFunc: QueryStatusFunction) {
        this._queryStatusFunc = () => {
            log('SCHEDULED QUERY STATUS');
            setTimeout(_queryStatusFunc, /*magic number for 'rapid' update. 1 second should? be enough*/1000);
        };
    }

    get queryStatusFunc() {
        return this._queryStatusFunc;
    }

    @withErrorAsync()
    @withApi()
    async next(api?: Api) {
        await api!.player.next.post();
        this._queryStatusFunc();
    }

    @withErrorAsync()
    @withApi()
    async previous(api?: Api) {
        await api!.player.previous.post();
        this._queryStatusFunc();
    }

    @withErrorAsync()
    @withApi()
    async play(api?: Api) {
        await api!.player.play.put({});
        this._queryStatusFunc();
    }

    @withErrorAsync()
    @withApi()
    async pause(api?: Api) {
        await api!.player.pause.put();
        this._queryStatusFunc();
    }

    playPause() {
        const { playerState } = getState();
        if (playerState.state === 'playing') {
            this.pause();
        } else {
            this.play();
        }
    }

    pollStatus(_cb: (status: ISpotifyStatusStatePartial) => void, getInterval: () => number) {
        let canceled = false;
        const p = createCancelablePromise<void>((_, reject) => {
            const _poll = async () => {
                if (canceled) {
                    return;
                }
                const api = getSpotifyWebApi();
                try {
                    if (api) {
                        log('GETTING STATUS');

                        const player = await api.player.get();
                        if (!player) {
                            reject(NOT_RUNNING_REASON);
                            return;
                        }

                        log('GOT STATUS', JSON.stringify(player));

                        if (!canceled) {
                            _cb({
                                isRunning: player.device.is_active,
                                playerState: {
                                    // fixme more than two states
                                    isRepeating: player.repeat_state !== 'off',
                                    isShuffling: player.shuffle_state,
                                    position: player.progress_ms,
                                    state: player.is_playing ? 'playing' : 'paused',
                                    volume: player.device.volume_percent
                                },
                                track: {
                                    album: player.item.album.name,
                                    artist: artistsToArtist(player.item.artists),
                                    name: player.item.name
                                },
                                context: player.context ? {
                                    uri: player.context.uri,
                                    trackNumber: player.item.track_number
                                } : void 0
                            });
                        }
                    }
                } catch (_e) {
                    reject(_e);
                    return;
                }
                setTimeout(_poll, getInterval());
            };
            _poll();
        });
        p.promise = p.promise.catch(err => {
            canceled = true;
            throw err;
        });
        return p;
    }

    @withErrorAsync()
    @withApi()
    async muteVolume(api?: Api) {
        this.prevVolume = getState().playerState.volume;
        if (this.prevVolume !== 0) {
            await api!.player.volume.put(0);
            this._queryStatusFunc();
        }
    }

    @withErrorAsync()
    @withApi()
    async unmuteVolume(api?: Api) {
        if (this.prevVolume) {
            await api!.player.volume.put(this.prevVolume);
            this._queryStatusFunc();
        }
    }

    muteUnmuteVolume() {
        const volume = getState().playerState.volume;
        if (volume === 0) {
            this.unmuteVolume();
        } else {
            this.muteVolume();
        }
    }

    @withErrorAsync()
    @withApi()
    async volumeUp(api?: Api) {
        const volume = getState().playerState.volume || 0;
        await api!.player.volume.put(Math.min(volume + 20, 100));
        this._queryStatusFunc();
    }

    @withErrorAsync()
    @withApi()
    async volumeDown(api?: Api) {
        const volume = getState().playerState.volume || 0;
        await api!.player.volume.put(Math.max(volume - 20, 0));
        this._queryStatusFunc();
    }

    @withErrorAsync()
    @withApi()
    async toggleRepeating(api?: Api) {
        const { playerState } = getState();
        // fixme more than two states
        await api!.player.repeat.put((!playerState.isRepeating) ? 'context' : 'off');
        this._queryStatusFunc();
    }

    @withErrorAsync()
    @withApi()
    async toggleShuffling(api?: Api) {
        const { playerState } = getState();
        await api!.player.shuffle.put(!playerState.isShuffling);
        this._queryStatusFunc();
    }

    @withErrorAsync()
    @withApi()
    async toggleLiked(api?: Api) {

        const uri = (await api!.player.currentlyPlaying.get()).item.uri.split(":")[2];
        const liked = (await api!.me.tracks.contains.get(uri))[0];

        if (!liked) {
            await api!.me.tracks.put(uri);
        } else {
            await api!.me.tracks.delete(uri);
        }
    }
}
