import API from '../api';

const GET_CASE_BEGIN = 'GET_CASE_BEGIN';
const GET_CASE_SUCCESS = 'GET_CASE_SUCCESS';
const GET_DETAILED_CASE_BEGIN = 'GET_DETAILED_CASE_BEGIN';
const GET_DETAILED_CASE_SUCCESS = 'GET_DETAILED_CASE_SUCCESS';
const ADD_CASE_BEGIN = 'ADD_CASE_BEGIN';
const ADD_CASE_SUCCESS = 'ADD_CASE_SUCCESS';
const UPDATE_CASE_BEGIN = 'UPDATE_CASE_BEGIN';
const UPDATE_CASE_SUCCESS = 'UPDATE_CASE_SUCCESS';

const initialState = {
  cases: [],
  loading: false,
};

export const getCase =
  (caseId, doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: GET_CASE_BEGIN, doInBackground });
    const dbCase = await API.cases.getCase(caseId);
    dispatch({ type: GET_CASE_SUCCESS, dbCase });
    return dbCase;
  };

export const getDetailedCase =
  (caseId, doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: GET_DETAILED_CASE_BEGIN, doInBackground });
    const dbCase = await API.cases.getDetailedCase(caseId);
    dispatch({ type: GET_DETAILED_CASE_SUCCESS, dbCase });
    return dbCase;
  };

export const addCase =
  (newCase, doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: ADD_CASE_BEGIN, doInBackground });
    const dbCase = await API.cases.addCase(newCase);
    dispatch({ type: ADD_CASE_SUCCESS, dbCase });
    return dbCase;
  };

export const updateCase =
  (updatedCase, doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: UPDATE_CASE_BEGIN, doInBackground });
    const dbCase = await API.cases.updateCase(updatedCase);
    dispatch({ type: UPDATE_CASE_SUCCESS, dbCase });
    return dbCase;
  };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_CASE_BEGIN:
    case ADD_CASE_BEGIN:
    case UPDATE_CASE_BEGIN:
      return {
        ...state,
        loading: action.doInBackground ? false : true,
      };

    case GET_CASE_SUCCESS:
    case GET_DETAILED_CASE_SUCCESS:
    case UPDATE_CASE_SUCCESS:
      return {
        ...state,
        cases: state.cases.map((c) => c.id).includes(action.dbCase.id)
          ? state.cases.map((c) => (c.id === action.dbCase.id ? action.dbCase : c))
          : [...state.cases, action.dbCase],
        loading: false,
      };

    case ADD_CASE_SUCCESS:
      return {
        ...state,
        cases: [...state.cases, action.dbCase],
        loading: false,
      };

    default:
      return state;
  }
}
