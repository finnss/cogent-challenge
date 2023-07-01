import API from '../api';

const GET_HELP_PAGES_BEGIN = 'GET_HELP_PAGES_BEGIN';
const GET_HELP_PAGES_SUCCESS = 'GET_HELP_PAGES_SUCCESS';
const GET_HELP_PAGE_BEGIN = 'GET_HELP_PAGE_BEGIN';
const GET_HELP_PAGE_SUCCESS = 'GET_HELP_PAGE_SUCCESS';
const ADD_HELP_PAGE_BEGIN = 'ADD_HELP_PAGE_BEGIN';
const ADD_HELP_PAGE_SUCCESS = 'ADD_HELP_PAGE_SUCCESS';
const UPDATE_HELP_PAGE_BEGIN = 'UPDATE_HELP_PAGE_BEGIN';
const UPDATE_HELP_PAGE_SUCCESS = 'UPDATE_HELP_PAGE_BEGIN';
const DELETE_HELP_PAGE_BEGIN = 'DELETE_HELP_PAGE_BEGIN';
const DELETE_HELP_PAGE_SUCCESS = 'DELETE_HELP_PAGE_BEGIN';

const SEND_FEEDBACK_BEGIN = 'SEND_FEEDBACK_BEGIN';
const SEND_FEEDBACK_SUCCESS = 'SEND_FEEDBACK_SUCCESS';

const initialState = {
  helpPages: [],
  loading: false,
};

export const getHelpPages =
  (doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: GET_HELP_PAGES_BEGIN, doInBackground });
    const helpPages = await API.helpPages.getHelpPages();
    dispatch({ type: GET_HELP_PAGES_SUCCESS, helpPages });
    return helpPages;
  };

export const getHelpPage =
  (id, doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: GET_HELP_PAGE_BEGIN, doInBackground });
    const helpPage = await API.helpPages.getHelpPage(id);
    dispatch({ type: GET_HELP_PAGE_SUCCESS, helpPage });
    return helpPage;
  };

export const addHelpPage =
  (newHelpPage, doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: ADD_HELP_PAGE_BEGIN, doInBackground });
    const helpPage = await API.helpPages.addHelpPage(newHelpPage);
    dispatch({ type: ADD_HELP_PAGE_SUCCESS, helpPage });
    return helpPage;
  };

export const updateHelpPage =
  (updatedHelpPage, doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: UPDATE_HELP_PAGE_BEGIN, doInBackground });
    const helpPage = await API.helpPages.updateHelpPage(updatedHelpPage);
    dispatch({ type: UPDATE_HELP_PAGE_SUCCESS, helpPage });
    return helpPage;
  };

export const deleteHelpPage =
  (id, doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: DELETE_HELP_PAGE_BEGIN, doInBackground });
    await API.helpPages.deleteHelpPage(id);
    dispatch({ type: DELETE_HELP_PAGE_SUCCESS, id });
    return id;
  };

// Feedback
export const submitFeedback =
  (message, doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: SEND_FEEDBACK_BEGIN, doInBackground });
    const response = await API.helpPages.sendFeedback(message);
    dispatch({ type: SEND_FEEDBACK_SUCCESS });
    return typeof response === 'string';
  };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_HELP_PAGE_BEGIN:
    case ADD_HELP_PAGE_BEGIN:
    case UPDATE_HELP_PAGE_BEGIN:
    case GET_HELP_PAGES_BEGIN:
    case DELETE_HELP_PAGE_BEGIN:
    case SEND_FEEDBACK_BEGIN:
      return {
        ...state,
        loading: action.doInBackground ? false : true,
      };

    case GET_HELP_PAGES_SUCCESS:
      return {
        ...state,
        helpPages: action.helpPages,
        loading: false,
      };

    case GET_HELP_PAGE_SUCCESS:
    case UPDATE_HELP_PAGE_SUCCESS:
      return {
        ...state,
        helpPages: state.helpPages.map((p) => p.id).includes(action.helpPage.id)
          ? state.helpPages.map((helpPage) => (helpPage.id === action.helpPage.id ? action.helpPage : helpPage))
          : [...state.helpPages, action.helpPage],
        loading: false,
      };

    case ADD_HELP_PAGE_SUCCESS:
      return {
        ...state,
        helpPages: [...state.helpPages, action.helpPage],
        loading: false,
      };

    case DELETE_HELP_PAGE_SUCCESS:
      return {
        ...state,
        helpPages: state.helpPages.filter((hp) => hp.id !== action.id),
        loading: false,
      };

    case SEND_FEEDBACK_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}
