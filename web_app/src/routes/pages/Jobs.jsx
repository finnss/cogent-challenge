/* eslint-disable react/prop-types */
import { Grid, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Container from '/components/Container';
import Loading from '/components/common/Loading';
import JobsTable from '/components/jobs/JobsTable';
import Link from '/components/common/Link';
import { getJobs } from '/modules/jobs';
import '/style/jobs.scss';

/*
 * Jobs is the only sub-route of the app, used to display a table containing all jobs.
 */
const Jobs = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const jobs = useSelector((state) => state.jobs.jobs);
  const isLoading = useSelector((state) => state.jobs.loading);

  // Fetch all jobs upon loading the page
  useEffect(() => {
    dispatch(getJobs());
  }, []);

  // Poll all jobs every 5 seconds in order to keep the table data up to date.
  useEffect(() => {
    const id = setInterval(() => {
      dispatch(getJobs(true));
    }, 1000 * 5);

    return () => clearInterval(id);
  }, []);

  const breadcrumbs = [
    { title: t('routes.home.page_title'), path: '/' },
    { title: t('routes.jobs.page_title'), path: '/jobs' },
  ];

  if (isLoading) {
    console.log('jobs isLoading');
    return (
      <Container showErrorPage>
        <Loading />
      </Container>
    );
  }

  return (
    <Container pageTitle={t('routes.jobs.page_title')} breadcrumbs={breadcrumbs}>
      <Grid className='JobsPage'>
        {jobs?.length > 0 ? (
          <JobsTable jobs={jobs} />
        ) : (
          <Grid item xs={12} style={{ maxWidth: '600px' }}>
            <Typography variant='h6'>{t('routes.jobs.no_jobs')}</Typography>
            <Typography className='WeakText' marginBottom={2}>
              {t('routes.jobs.no_jobs_desc')}
            </Typography>
            <Link to='/'>Go to upload page</Link>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default React.memo(Jobs);
