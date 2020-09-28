import * as express from 'express';
import { Server } from 'http';

import { getAuthServerUrl } from '../../config/spotify-config';
import { log } from '../../info/info';

export interface CreateDisposableAuthSeverPromiseResult {
    accessToken: string;
    refreshToken: string;
}

export function createDisposableAuthSever() {
    let server: Server;
    const createServerPromise = new Promise<CreateDisposableAuthSeverPromiseResult>((res, rej) => {
        setTimeout(() => {
            rej('Timeout error. No response for 10 minutes.');
        }, 10 * 60 * 1000 /*10 minutes*/);
        try {
            const app = express();

            app.get('/callback', (request, response) => {
                const { access_token: accessToken, refresh_token: refreshToken, error } = request.query;
                if (!error) {
                    res({ accessToken, refreshToken });
                } else {
                    rej(error);
                }
                response.redirect(`${getAuthServerUrl()}/?message=${encodeURIComponent('You can now close this tab')}`);
                request.destroy();
            });

            server = app.listen(8350);
        } catch (e) {
            rej(e);
        }
    });

    return {
        createServerPromise,
        dispose: () => server && server.close(() => {
            log('server closed');
        })
    };
}
