import { SpotifyClient, createCancelablePromise, QueryStatusFunction, NOT_RUNNING_REASON } from './spotify-client';
import { ISpotifyStatusStatePartial } from '../state/state';
import { getState } from '../store/store';
import { withApi, getSpotifyWebApi, withErrorAsync } from '../actions/actions';
import { Api } from '@vscodespotify/spotify-common/lib/spotify/api';
import { log } from '../info/info';

export class WebApiSpotifyClient implements SpotifyClient {
    private prevVolume: number;
    private _queryStatusFunc: QueryStatusFunction;

    constructor(_queryStatusFunc: QueryStatusFunction) {
        this._queryStatusFunc = () => {
            log('SCHEDULED QUERY STATUS');
            setTimeout(_queryStatusFunc, /*magic number for 'rapid' update. 1 second should? be enough*/1000);
        };
    }

    get queryStatusFunc(){
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
                        log('GETTING STATUS')
                        const player = await api.player.get();
                        if (!player) {
                            reject(NOT_RUNNING_REASON);
                            return;
                        }
                        log('GOT STATUS', JSON.stringify(player));
                        !canceled && _cb({
                            isRunning: player.device.is_active,
                            playerState: {
                                //fixme more than two states
                                isRepeating: player.repeat_state !== "off",
                                isShuffling: player.shuffle_state,
                                position: player.progress_ms,
                                state: player.is_playing ? 'playing' : 'paused',
                                volume: player.device.volume_percent
                            },
                            track: {
                                album: player.item.album.name,
                                artist: player.item.artists.map((a => a.name)).join(', '),
                                name: player.item.name
                            },
                            context: player.context ? {
                                uri: player.context.uri,
                                trackNumber: player.item.track_number
                            } : void 0
                        });
                    }
                } catch (_e) {
                    reject(_e);
                    return;
                }
                setTimeout(_poll, getInterval());
            };
            _poll();
        });
        p.promise = p.promise.catch((err) => {            
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
        //fixme more than two states
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
}
