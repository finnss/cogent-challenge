import API from './api';

export const getCase = (caseId) => API.GET(`cases/${caseId}`);

export const getDetailedCase = (caseId) => API.GET(`cases/${caseId}/detailed`);

export const addCase = (caseObj) => {
  return API.POST('cases', caseObj);
};

export const updateCase = (caseObj) => {
  return API.PATCH(`cases/${caseObj.id}`, caseObj);
};

export const deleteCase = (caseId) => API.DELETE(`cases/${caseId}`);
