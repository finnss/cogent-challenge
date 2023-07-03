import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useExitPagePrompt } from '/util';
import Container from '/components/Container';
import Loading from '/components/common/Loading';
import { showToast } from '/modules/toast';
import { getJob, getJobs } from '/modules/jobs';
import { uploadImage } from '/modules/images';
import JobsTable from '/components/JobsTable';
import '/style/home.scss';
import '/style/jobstable.scss';
import '/style/table.scss';
import Link from '/components/common/Link';

const Home = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const jobs = useSelector((state) => state.jobs.jobs);
  // console.log('jobs', jobs);
  const isLoading = useSelector((state) => state.jobs.loading);
  const [jobForUploadedImage, setJobForUploadedImage] = useState();

  useExitPagePrompt(t('routes.home.confirm_navigation'), false);

  useEffect(() => {
    dispatch(getJobs());
  }, []);

  // Poll the job every 3 seconds until it's done
  useEffect(() => {
    console.log('outside poll. jobForUploadedImage', jobForUploadedImage);
    if (jobForUploadedImage?.id) {
      const id = setInterval(async () => {
        console.log('in poll. jobForUploadedImage', jobForUploadedImage);
        if (jobForUploadedImage?.id) {
          const { job } = await dispatch(getJob(jobForUploadedImage.id, true));
          console.log('job', job);
          setJobForUploadedImage(job);
          if (jobForUploadedImage.status === 'complete') clearInterval(id);
        } else {
          clearInterval(id);
        }
      }, 1000 * 3);
      return () => clearInterval(id);
    }
  }, [jobForUploadedImage]);

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
    const { jobId } = await dispatch(uploadImage(data, true));
    if (jobId) {
      console.log('jobId', jobId);
      dispatch(showToast(t('routes.home.upload_successful')));
      const { job } = await dispatch(getJob(jobId, true));
      console.log('job', job);
      if (job) {
        setJobForUploadedImage(job);
      }
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
            <Grid item xs={12} marginBottom={3} style={{ maxWidth: '800px' }}>
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

              {jobForUploadedImage ? (
                <Grid item container xs={12} spacing={1} style={{ maxWidth: '1000px' }} marginTop={5}>
                  <JobsTable
                    jobs={[jobForUploadedImage]}
                    title={t('routes.home.jobs_title')}
                    subtitle={t('routes.home.jobs_subtitle')}
                    includeCount={false}
                  />

                  <Grid item xs={12} className='LinkToJobs'>
                    <Link to='/jobs'>
                      See all jobs <ArrowRightIcon style={{ marginBottom: '-5px' }} />
                    </Link>
                  </Grid>
                </Grid>
              ) : (
                <Grid item xs={12} className='LinkToJobs' marginTop={3}>
                  <Link to='/jobs'>
                    See all emojis <ArrowRightIcon style={{ marginBottom: '-5px' }} />
                  </Link>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default React.memo(Home);
