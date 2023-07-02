import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useExitPagePrompt } from '/util';
import Container from '/components/Container';
import Loading from '/components/common/Loading';
import { showToast } from '/modules/toast';
import { getJobs } from '/modules/jobs';
import { uploadImage } from '/modules/images';
import JobsTable from '/components/JobsTable';
import '../../style/home.scss';

const Home = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const jobs = useSelector((state) => state.jobs.jobs);
  const isLoading = useSelector((state) => state.jobs.loading);

  useExitPagePrompt(t('routes.home.confirm_navigation'), false);

  useEffect(() => {
    dispatch(getJobs());
  }, []);

  const onUploadImage = async (e) => {
    const file = e?.target?.files?.length > 0 ? e.target.files[0] : null;

    console.log('Uploading image. file', file);
    if (!file) {
      dispatch(showToast(t('errors.upload_start')));
    }
    dispatch(showToast(t('routes.home.upload_started')));

    const data = new FormData();
    await data.append('image', file);
    // await data.append('filename', file.name);
    console.log('data', data);
    console.log('data.get(image)', data.get('image'));
    const uploadedImage = await dispatch(uploadImage(data, true));
    if (uploadedImage) {
      dispatch(showToast(t('routes.home.upload_successful')));
    }
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
              <Typography variant='h5' className='MainTitle'>
                {t('routes.home.title')}
              </Typography>

              <Button variant='contained' className='UploadButton' component='label'>
                {t('routes.home.upload')}
                <input
                  type='file'
                  accept='image/*'
                  hidden
                  encType='multipart/form-data'
                  onChange={onUploadImage}
                  onClick={(event) => {
                    event.target.value = null;
                  }}
                  multiple={false}
                />
              </Button>
            </Grid>

            {jobs?.length > 0 && <JobsTable jobs={jobs} />}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default React.memo(Home);
