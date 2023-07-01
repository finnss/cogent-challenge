import API from './api';

export const getPerson = (id) => API.GET(`persons/${id}`);

export const getDetailedPerson = (id) => API.GET(`persons/${id}/detailed`);

export const registerPerson = (person) => {
  return API.POST('persons', person);
};

export const updatePerson = (person) => {
  return API.PATCH(`persons/${person.id}`, person);
};

export const deletePerson = (id) => API.DELETE(`persons/${id}`);
