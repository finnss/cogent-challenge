import API from './api';

export const getDistrict = (id) => API.GET(`districts/${id}`);

export const getDistricts = () => API.GET('districts');
