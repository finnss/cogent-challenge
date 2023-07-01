import API from './api';

export const getHelpPages = () => API.GET('helpPages');

export const getHelpPage = (id) => API.GET(`helpPages/${id}`);

export const addHelpPage = (helpPage) => {
  return API.POST('helpPages', helpPage);
};

export const updateHelpPage = (helpPage) => {
  return API.PATCH(`helpPages/${helpPage.id}`, helpPage);
};

export const deleteHelpPage = (id) => API.DELETE(`helpPages/${id}`);

export const sendFeedback = (message) => API.POST('helpPages/feedback', message);
