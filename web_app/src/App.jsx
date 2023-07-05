import React, { memo } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, StyledEngineProvider } from '@mui/material';
import 'dayjs/locale/nb';
import './i18n';
import muiTheme from './style/theme';
import Routing from './routes';
import store from './store';

/**
 * App is the root component and entry point for the frontend
 */
function App() {
  return (
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={muiTheme}>
          <BrowserRouter>
            <Routing />
          </BrowserRouter>
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
}

export default memo(App);
