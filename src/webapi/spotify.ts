import { xhr } from '../request/request';
import { getSpotifyApiUrl } from '../config/spotify-config';
import { getState } from '../store/store';

/*
@see https://beta.developer.spotify.com/documentation/web-api/#response-status-codes
200	OK - The request has succeeded. The client can read the result of the request in the body and the headers of the response.
201	Created - The request has been fulfilled and resulted in a new resource being created.
202	Accepted - The request has been accepted for processing, but the processing has not been completed.
204	No Content - The request has succeeded but returns no message body.
304	Not Modified. See Conditional requests.
400	Bad Request - The request could not be understood by the server due to malformed syntax. The message body will contain more information; see Response Schema.
401	Unauthorized - The request requires user authentication or, if the request included authorization credentials, authorization has been refused for those credentials.
403	Forbidden - The server understood the request, but is refusing to fulfill it.
404	Not Found - The requested resource could not be found. This error can be due to a temporary or permanent condition.
429	Too Many Requests - Rate limiting has been applied.
500	Internal Server Error. You should never receive this error because our clever coders catch them all … but if you are unlucky enough to get one, please report it to us through a comment at the bottom of this page.
502	Bad Gateway - The server was acting as a gateway or proxy and received an invalid response from the upstream server.
503	Service Unavailable - The server is currently unable to handle the request due to a temporary condition which will be alleviated after some delay. You can choose to resend the request again.
*/

async function makeSpotifyRequest(urlPart: string) {
    const state = getState();
    const accessToken = state.loginState && state.loginState.accessToken;
    if (!accessToken) {
        //fixme show error?
        throw 'No access token';
    }

    return await xhr({ url: `${getSpotifyApiUrl()}${urlPart}`, headers: { 'Authorization': 'Bearer ' + accessToken } })!;
}



export async function getPlaylists() {
    try {
        const result = await makeSpotifyRequest('/me/playlists');
        console.log(result.responseText);
    } catch (e) {
        //fixme 
        throw e;
    }
}