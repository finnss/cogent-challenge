import * as themes from '/style/themes';
import API from '../api';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';
const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
const SET_THEME = 'SET_THEME';

const initialState = {
  currentUser: null,
  isLoggedIn: false,
  theme: themes.defaultTheme,
};

export const login = (username, password) => async (dispatch) => {
  const currentUser = await API.auth.login(username, password);
  if (currentUser) {
    dispatch({ type: LOGIN_SUCCESS, currentUser });
    window.localStorage.setItem('currentUser', JSON.stringify(currentUser));
    return currentUser;
  } else {
    dispatch({ type: LOGIN_FAILURE });
    window.localStorage.removeItem('currentUser');
    return;
  }
};

export const logout = () => async (dispatch) => {
  // Remove HttpOnly cookies using backend
  await API.auth.logout();
  window.localStorage.removeItem('currentUser');
  dispatch({ type: LOGOUT_SUCCESS });
};

export const setTheme = (theme) => (dispatch) => {
  dispatch({ type: SET_THEME, theme });
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        currentUser: action.currentUser,
        isLoggedIn: true,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        currentUser: null,
        isLoggedIn: false,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        currentUser: null,
        isLoggedIn: false,
      };
    case SET_THEME:
      return {
        ...state,
        theme: action.theme,
      };
    default:
      return state;
  }
}
