import API from './api';

// FIXME: Implement properly in environment with AD
// export const login = (username, password) => API.POST('auth/signin', { authCode: 'AAA000' });
export const login = (username, password) => API.POST('auth/signin/basic', { username, password });

export const logout = () => API.POST('auth/signout');

export const refreshToken = () => API.GET('auth/refresh');
