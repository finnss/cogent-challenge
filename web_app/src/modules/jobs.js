import API from '../api';

const GET_JOBS_BEGIN = 'GET_JOBS_BEGIN';
const GET_JOBS_SUCCESS = 'GET_JOBS_SUCCESS';
const GET_JOB_BEGIN = 'GET_JOB_BEGIN';
const GET_JOB_SUCCESS = 'GET_JOB_SUCCESS';
const DELETE_JOB_BEGIN = 'DELETE_JOB_BEGIN';
const DELETE_JOB_SUCCESS = 'DELETE_JOB_BEGIN';

const initialState = {
  jobs: [],
  loading: false,
};

export const getJobs =
  (doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: GET_JOBS_BEGIN, doInBackground });
    const jobs = (await API.jobs.getJobs())?.jobs;
    dispatch({ type: GET_JOBS_SUCCESS, jobs });
    return jobs;
  };

export const getJob =
  (id, doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: GET_JOB_BEGIN, doInBackground });
    const job = await API.jobs.getJob(id);
    dispatch({ type: GET_JOB_SUCCESS, job });
    return job;
  };

export const deleteJob =
  (id, doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: DELETE_JOB_BEGIN, doInBackground });
    const a = await API.jobs.deleteJob(id);
    dispatch({ type: DELETE_JOB_SUCCESS, id });
    return id;
  };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_JOB_BEGIN:
    case GET_JOBS_BEGIN:
      return {
        ...state,
        loading: action.doInBackground ? false : true,
      };

    case GET_JOBS_SUCCESS:
      return {
        ...state,
        jobs: action.jobs,
        loading: false,
      };

    case GET_JOB_SUCCESS:
      return {
        ...state,
        jobs: state.jobs.map((p) => p.id).includes(action.job.id)
          ? state.jobs.map((job) => (job.id === action.job.id ? action.job : job))
          : [...state.jobs, action.job],
        loading: false,
      };

    case DELETE_JOB_SUCCESS:
      return {
        ...state,
        jobs: state.jobs.filter((job) => job.id !== action.id),
        loading: false,
      };

    default:
      return state;
  }
}
