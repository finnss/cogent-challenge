import API from './api';

export const performSearch = (searchText) => API.POST(`search`, { searchText });

export const fregLookup = (personNr) => API.POST(`search/freg`, { personNr });
