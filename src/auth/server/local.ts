import * as express from 'express';
import { Server } from 'http';
import { getAuthServerUrl } from '../../config/spotify-config';

export interface CreateDisposableAuthSeverPromiseResult {
    access_token: string,
    refresh_token: string,
}

export const createDisposableAuthSever = () => {
    let server: Server;
    const createServerPromise = new Promise<CreateDisposableAuthSeverPromiseResult>((res, rej) => {
        setTimeout(() => {
            rej('Timeout error. No response for 10 minutes.');
        }, 10 * 60 * 1000 /*10 minutes*/);
        try {
            const app = express();

            app.get('/callback', function (request, response) {
                const { access_token, refresh_token, error } = request.query;
                if (!error) {
                    res({ access_token, refresh_token });
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
        createServerPromise, dispose: () => {
            server && server.close(() => {
                console.log('server closed');
            });
        }
    }
}
