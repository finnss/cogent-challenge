import ApiError from '../api/apiError';
import { logout } from '/api/auth';
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

    // In JwtAuthFilter backend we don't have access to the error "type", so we need to handle translation to
    // toastMessage manually for some cases here.
    if (error.status === 403) {
      if (!error.type) {
        console.log('no error type. message', error.message);

        // 403 can potentially indicate that we need to log the user out if one of two things is true:
        // either the current session has timed out and user has to login again,
        // or they haven't actually logged in uet. In either case, we log them out, which
        // then redirects to the login screen.
        if (error.message.includes('missing auth token')) {
          toastMessage = i18n.t('errors.backend.missing_auth_token');
          dispatch(logout());
        } else if (error.message.includes('invalid auth token')) {
          toastMessage = i18n.t('errors.backend.invalid_auth_code');
          dispatch(logout());
        }
        // If instead the 403 indicated that the user tried accessing something they lack permission for, we don't
        // log them out.
        else {
          toastMessage = i18n.t('errors.backend.missing_permission');
        }
      }
    }
    errMessage = `API Error ${error.status}. Type: ${error.type}. Message from backend: ${error.message}`;
  } else {
    errMessage = _.get(error, ['response', 'data', 'message', 'statusText'], `Unknown Error: ${error}`);
  }
  // Log detailed error message
  console.error('Error details:', errMessage, '\nDisplaying pretty error message to user in toast: ', toastMessage);

  dispatch(showToast(toastMessage, -1, 'error'));
  dispatch(setErrorStatusForPage(error.status));
};
