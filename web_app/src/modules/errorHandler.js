import ApiError from '../api/apiError';
import { showToast } from '/modules/toast';
import i18n from '/i18n';

const SET_ERROR_STATUS = 'SET_ERROR_STATUS';
const CLEAR_ERROR_STATUS = 'CLEAR_ERROR_STATUS';

const initialState = {
  errorStatusForPage: undefined,
};

export const setErrorStatusForPage = (errorStatusForPage) => {
  return {
    type: SET_ERROR_STATUS,
    errorStatusForPage,
  };
};

export const clearError = () => ({
  type: CLEAR_ERROR_STATUS,
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_ERROR_STATUS: {
      return {
        ...state,
        errorStatusForPage: action.errorStatusForPage,
      };
    }

    case CLEAR_ERROR_STATUS:
      return {
        ...state,
        errorStatusForPage: undefined,
      };

    default:
      return state;
  }
}

const formatBackendError = (error) => {
  if (!error || !error.type) return i18n.t('errors.generic');
  return i18n.t(`errors.backend.${error.type}`);
};

export const newError = (error) => (dispatch) => {
  console.error('Frontend caught error:', error);

  let errMessage;
  // We don't want to display potentially confusing backend errors to end users,
  // so for the Toast we usually show a generic message.
  let toastMessage = i18n.t('errors.generic');
  if (typeof error === 'string') {
    errMessage = error;
  } else if (error instanceof ApiError) {
    toastMessage = formatBackendError(error);
    errMessage = `API Error ${error.status}. Type: ${error.type}. Message from backend: ${error.message}`;
  } else {
    errMessage = _.get(error, ['response', 'data', 'message', 'statusText'], `Unknown Error: ${error}`);
  }
  // Log detailed error message
  console.error('Error details:', errMessage, '\nDisplaying pretty error message to user in toast: ', toastMessage);

  dispatch(showToast(toastMessage, -1, 'error'));
  dispatch(setErrorStatusForPage(error.status));
};
