import React, { memo } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, StyledEngineProvider } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/nb';
import './i18n';
import muiTheme from './style/theme';
import Routing from './routes';
import store from './store';
import { LocalizationProvider } from '@mui/x-date-pickers';

/**
 * App is the root component and entry point
 * for Alfa-frontend
 * @returns {JSX.Element} Alfa-frontend
 */
function App() {
  return (
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='nb'>
          <ThemeProvider theme={muiTheme}>
            <BrowserRouter>
              <Routing />
            </BrowserRouter>
          </ThemeProvider>
        </LocalizationProvider>
      </StyledEngineProvider>
    </Provider>
  );
}

App = memo(App);
const root = createRoot(document.getElementById('main')).render(<App />);
