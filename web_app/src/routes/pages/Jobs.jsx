/* eslint-disable react/prop-types */
import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import '../../style/image.scss';

import Container from '../../components/Container';
import Loading from '../../components/common/Loading';
import JobsTable from '/components/JobsTable';
import { getJobs } from '/modules/jobs';

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
    { title: t('common.strings.home'), path: '/' },
    { title: t('routes.home.jobs'), path: '/jobs' },
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
      <Grid className='JobsPage'>{jobs?.length > 0 && <JobsTable jobs={jobs} />}</Grid>
    </Container>
  );
};

export default React.memo(Jobs);
