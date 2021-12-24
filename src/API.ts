namespace Darblast {
export namespace API {


/**
 * Represents an HTTP verb.
 *
 * Can be one of: `GET`, `POST`, `PUT`, and `DELETE`.
 */
export type HttpVerb = 'GET' | 'POST' | 'PUT' | 'DELETE';


/**
 * Wraps an HTTP error status that can be returned by the server.
 *
 * This is thrown as an exception by the various API functions when the HTTP
 * status code is different from 200.
 */
export class HttpError extends Error {
  public constructor(
      public readonly verb: HttpVerb,
      public readonly url: string,
      public readonly status: number)
  {
    super(`HTTP error ${status} for ${verb} ${JSON.stringify(url)}`);
  }
}


function encode(prefix: string, data?: any): string[] {
  switch (typeof data) {
  case 'undefined':
    return [];
  case 'boolean':
    if (data) {
      return [encodeURIComponent(prefix)];
    } else {
      return [];
    }
  case 'string':
  case 'number':
    return [encodeURIComponent(prefix) + '=' + encodeURIComponent(data)];
  case 'object':
    if (Array.isArray(data)) {
      return Utilities.flatten(data.map((item, index) =>
          encode(`${prefix}%5B${index}%5D`, item)));
    } else if (data !== null) {
      if (prefix) {
        prefix += '.';
      }
      const entries: string[] = [];
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          entries.push.apply(entries, encode(prefix + key, data[key]));
        }
      }
      return entries;
    } else {
      return [];
    }
  default:
    throw new TypeError();
  }
}


/**
 * Fires a GET request and returns the parsed JSON.
 *
 * The input parameters are recursively URL-encoded. For example, the following
 * call:
 *
 * ```js
 * API.getJSON('https://foo/bar', {
 *   "lorem": "ipsum dolor",
 *   "amet": [
 *     "adipisci",
 *     {
 *       "elit": 123,
 *     },
 *     456,
 *   ],
 * })
 * ```
 *
 * will result in a GET request to the following URL:
 *
 * ```
 * https://foo/bar?lorem=ipsum%20dolor&amet%5B0%5D=adipisci&amet%5B1%5D.elit=123&amet%5B2%5D=456
 * ```
 *
 * This function assumes the server will respond in JSON in case of success
 * (HTTP status 200); the behavior is undefined if the response doesn't contain
 * valid JSON. For all other status codes an {@link HttpError} is thrown.
 *
 * @param url the URL to GET.
 * @param params request parameters.
 * @returns the parsed JSON response.
 * @throws an {@link HttpError} if the server responds with an error status.
 */
export async function getJSON(url: string, params?: Object): Promise<Object> {
  const encodedParams = encode('', params);
  if (encodedParams.length > 0) {
    url += '?' + encodedParams.join('&');
  }
  const response = await window.fetch(url, {
    method: 'GET',
  });
  if (response.status !== 200) {
    throw new HttpError('GET', url, response.status);
  }
  return await response.json();
}


async function requestJSON(
    verb: HttpVerb, url: string, params?: Object): Promise<Object>
{
  const request: RequestInit = {method: verb};
  if (params) {
    request.headers = {
      'Content-Type': 'application/json',
    };
    request.body = JSON.stringify(params);
  }
  const response = await window.fetch(url, request);
  if (response.status !== 200) {
    throw new HttpError(verb, url, response.status);
  }
  return await response.json();
}


/**
 * Fires a POST request to the specified URL.
 *
 * The `params` parameters are encoded in JSON and sent in the request body
 * along with a `Content-Type: application/json` header.
 *
 * This function assumes the server will respond in JSON in case of success
 * (HTTP status 200); the behavior is undefined if the response doesn't contain
 * valid JSON. For all other status codes an {@link HttpError} is thrown.
 *
 * @param url the URL to POST.
 * @param params request parameters.
 * @returns the parsed JSON response.
 * @throws an {@link HttpError} if the server responds with an error status.
 */
export function postJSON(url: string, params?: Object): Promise<Object> {
  return requestJSON('POST', url, params);
}


/**
 * Fires a PUT request to the specified URL.
 *
 * The `params` parameters are encoded in JSON and sent in the request body
 * along with a `Content-Type: application/json` header.
 *
 * This function assumes the server will respond in JSON in case of success
 * (HTTP status 200); the behavior is undefined if the response doesn't contain
 * valid JSON. For all other status codes an {@link HttpError} is thrown.
 *
 * @param url the URL to PUT.
 * @param params request parameters.
 * @returns the parsed JSON response.
 * @throws an {@link HttpError} if the server responds with an error status.
 */
export function putJSON(url: string, params?: Object): Promise<Object> {
  return requestJSON('PUT', url, params);
}


/**
 * Fires a DELETE request to the specified URL.
 *
 * The `params` parameters are encoded in JSON and sent in the request body
 * along with a `Content-Type: application/json` header.
 *
 * This function assumes the server will respond in JSON in case of success
 * (HTTP status 200); the behavior is undefined if the response doesn't contain
 * valid JSON. For all other status codes an {@link HttpError} is thrown.
 *
 * @param url the URL to DELETE.
 * @param params request parameters.
 * @returns the parsed JSON response.
 * @throws an {@link HttpError} if the server responds with an error status.
 */
export function deleteJSON(url: string, params?: Object): Promise<Object> {
  return requestJSON('DELETE', url, params);
}


}  // namespace API
}  // namespace Darblast
