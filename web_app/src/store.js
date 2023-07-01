import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import auth from '/modules/auth';
import persons from '/modules/persons';
import search from '/modules/search';
import toast from '/modules/toast';
import cases from '/modules/cases';
import riskAssessments from '/modules/riskAssessments';
import statistics from '/modules/statistics';
import errors from '/modules/errorHandler';
import districts from '/modules/districts';
import help from '/modules/help';

const production = process.env.NODE_ENV === 'production';

/**
 * Global Redux-store
 */
const store = configureStore({
  // configureStore will automatically combine reducers
  reducer: {
    auth,
    persons,
    search,
    toast,
    cases,
    riskAssessments,
    statistics,
    errors,
    districts,
    help,
  },
  devTools: production ? false : true,
});

export default store;
