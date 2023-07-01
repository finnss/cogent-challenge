import API from '../api';

const GET_STATISTICS_BEGIN = 'GET_STATISTICS_BEGUN';
const GET_STATISTICS_SUCCESS = 'GET_STATISTICS_SUCCESS';

const initialState = {
  statistics: {},
  loading: false,
};

export const getStatistics =
  (url, doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: GET_STATISTICS_BEGIN, doInBackground });
    const statistics = await API.statistics.getStatistics(url);
    dispatch({ type: GET_STATISTICS_SUCCESS, statistics });
    return statistics;
  };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_STATISTICS_BEGIN:
      return {
        ...state,
        loading: action.doInBackground ? false : true,
      };

    case GET_STATISTICS_SUCCESS:
      return {
        ...state,
        statistics: action.statistics,
        loading: false,
      };

    default:
      return state;
  }
}
