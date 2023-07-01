/* eslint-disable react/prop-types */
import EditIcon from '@mui/icons-material/Edit';
import { Button, Grid, Typography } from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../style/home.scss';

import { useExitPagePrompt } from '../../util';
import Container from '../../components/Container';
import Loading from '../../components/common/Loading';
import Table from '../../components/table/Table';
import dayjs from 'dayjs';
import { showToast } from '/modules/toast';
import { getJobs } from '/modules/jobs';

const Home = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const jobs = useSelector((state) => state.jobs.jobs);
  const isLoading = useSelector((state) => state.jobs.loading);

  useExitPagePrompt(t('routes.home.confirm_navigation'), false);

  useEffect(() => {
    dispatch(getJobs());
  }, []);

  const jobColumns = useMemo(
    () => [
      {
        Header: t('routes.home.job_id'),
        accessor: 'id',
        Cell: ({ cell }) => <Typography variant='body2'>{cell.value}</Typography>,
      },
    ],
    []
  );

  const onJobRowClick = (e, row) => {
    const job = row?.original;
    const { id } = job;
    navigate(`/images/${id}`);
  };

  if (isLoading) {
    return (
      <Container showErrorPage>
        <Loading />
      </Container>
    );
  }

  return (
    <Container
      pageTitle={t('routes.home.page_title')}
      contentClassName='ContentContainer'
      pageClassName='PageContainer'>
      <Grid className='HomePage'>
        <Grid container className='OuterGridContainer'>
          <Grid item container xs={12} direction='row' className='GridContainer' spacing={5}>
            <Grid item xs={12} marginBottom={3}>
              <Typography variant='h5' style={{ fontWeight: 500 }}>
                {t('routes.home.title')}
              </Typography>

              <Button variant='filled' className='UploadButton'>
                {t('routes.home.upload')}
              </Button>
            </Grid>

            {jobs?.length > 0 && (
              <Grid item xs={12}>
                <Table
                  title={t('routes.home.jobs')}
                  subtitle={t('routes.home.jobs_description')}
                  columns={jobColumns}
                  data={jobs || []}
                  defaultSort={{ id: 'createdAt', desc: true }}
                  dense
                  onClick={onJobRowClick}
                  includeCount={jobs?.length > 0}
                  hideTable={jobs?.length === 0}
                />
              </Grid>
            )}

            {/* : (
              <Grid item xs={12} className='NoJobs' marginTop={1}>
                <Typography variant='h6'>{t('routes.home.jobs')}</Typography>
                <Typography className='WeakText NoJobsDesc'>{t('routes.home.no_jobs_desc')}</Typography>
              </Grid>
            )} */}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default React.memo(Home);
