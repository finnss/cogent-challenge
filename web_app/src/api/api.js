/* eslint-disable no-undef */
// API_HOST from webpack define plugin
import ApiError from './apiError';
import { newError } from '/modules/errorHandler';

const responseHandler = async (res) => {
  if (!res.ok) {
    const store = require('../store').default;
    if (res.status === 401) {
      store.dispatch(logout());
    }
    const errorResponse = await res.json();
    console.error('Got error from backend:', errorResponse);
    store.dispatch(newError(new ApiError(res, errorResponse)));
    return;
  }

  const contentType = res.headers.get('Content-Type');
  console.log('contentType', contentType);
  const isJson = contentType !== null && contentType.includes('application/json');
  console.log('isJson', isJson);

  return isJson ? res.json() : res.text();
};

const connectionErrorHandler = async (err) => {
  // This should only happen if there was a problem communicating with the backend. Other errors (like 404)
  // are handled in responseHandler.
  if (err?.message.includes('Failed to fetch')) {
    const store = require('../store').default;
    // By setting the status manually here, we ensure the user sees a "Timeout" error page.
    err.status = 'timeout';
    store.dispatch(newError(err));
    return;
  }
  throw err;
};

// API_HOST from webpack define plugin
const API = {
  GET: (path) =>
    window.fetch(`${API_HOST}/${path}`, { method: 'GET' }).then(responseHandler).catch(connectionErrorHandler),
  POST: (path, options) =>
    window
      .fetch(`${API_HOST}/${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options?.body),
        ...options,
      })
      .then(responseHandler)
      .catch(connectionErrorHandler),
  PATCH: (path, options) =>
    window
      .fetch(`${API_HOST}/${path}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        ...options,
      })
      .then(responseHandler)
      .catch(connectionErrorHandler),
  DELETE: (path) =>
    window.fetch(`${API_HOST}/${path}`, { method: 'DELETE' }).then(responseHandler).catch(connectionErrorHandler),
};

export default API;
