import { configureStore } from '@reduxjs/toolkit';

import toast from '/modules/toast';
import errors from '/modules/errorHandler';
import images from './modules/images';
import jobs from './modules/jobs';
import theme from './modules/theme';

const production = process.env.NODE_ENV === 'production';

/**
 * Global Redux-store
 */
const store = configureStore({
  // configureStore will automatically combine reducers
  reducer: {
    theme,
    toast,
    errors,
    images,
    jobs,
  },
  devTools: production ? false : true,
});

export default store;
