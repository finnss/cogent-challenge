import API from './api';

export const getJobs = () => API.GET('jobs');

export const getJob = (id) => API.GET(`jobs/${id}`);

export const addJob = (job) => {
  return API.POST('jobs', job);
};

export const updateJob = (job) => {
  return API.PATCH(`jobs/${job.id}`, job);
};

export const deleteJob = (id) => API.DELETE(`jobs/${id}`);
