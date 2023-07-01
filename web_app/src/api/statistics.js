import API from './api';

export const getStatistics = (url) => API.GET(`statistics/${url}`);
