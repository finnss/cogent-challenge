/* eslint-disable react/prop-types */
import { Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import '../../style/jobs.scss';

import Container from '../../components/Container';
import Loading from '../../components/common/Loading';
import JobsTable from '/components/JobsTable';
import { getJobs } from '/modules/jobs';
import Link from '/components/common/Link';

const Jobs = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const jobs = useSelector((state) => state.jobs.jobs);
  console.log('jobs', jobs);
  const isLoading = useSelector((state) => state.jobs.loading);
  const [currentImage, setCurrentImage] = useState();

  useEffect(() => {
    dispatch(getJobs());
  }, []);

  const breadcrumbs = [
    { title: t('routes.home.page_title'), path: '/' },
    { title: t('routes.jobs.page_title'), path: '/jobs' },
  ];

  if (isLoading) {
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
