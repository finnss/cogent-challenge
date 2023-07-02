import * as themes from '../style/themes';

const SET_THEME = 'SET_THEME';

const initialState = {
  theme: themes.defaultTheme,
};

export const setTheme = (theme) => (dispatch) => {
  dispatch({ type: SET_THEME, theme });
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_THEME:
      return {
        ...state,
        theme: action.theme,
      };
    default:
      return state;
  }
}
