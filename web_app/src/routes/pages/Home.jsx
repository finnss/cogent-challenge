import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { showToast } from '/modules/toast';
import { getJob } from '/modules/jobs';
import { uploadImage } from '/modules/images';
import JobsTable from '/components/jobs/JobsTable';
import Container from '/components/Container';
import Loading from '/components/common/Loading';
import Link from '/components/common/Link';
import '/style/home.scss';
import '/style/jobstable.scss';
import '/style/table.scss';

/*
 * Home is the main component of the app. It shows an upload button for starting
 * thumbnail generation jobs, as well as conditionally a table showing the status
 * of the recently started job.
 */
const Home = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.jobs.loading);
  const [pollJobId, setPollJobId] = useState();
  const [jobForUploadedImage, setJobForUploadedImage] = useState();

  // Main function used for uploading an image for thumbnail generation.
  // The image is sent as multipart/form-data, which allows for easy handling backend.
  // After the image has been successfully uploaded, we recieve a job id
  // that can be used to call the /jobs/:id endpoint to retrieve up-to-date
  // information about the processing status of our job, and when finished,
  // the resulting Thumbnail.
  const onUploadImage = async (e) => {
    const file = e?.target?.files?.length > 0 ? e.target.files[0] : null;
    if (!file) {
      dispatch(showToast(t('errors.upload_start')));
    }
    dispatch(showToast(t('routes.home.upload_started')));

    const data = new FormData();
    await data.append('image', file);

    const { jobId } = await dispatch(uploadImage(data, true));
    if (jobId) {
      dispatch(showToast(t('routes.home.upload_successful')));

      const job = await dispatch(getJob(jobId, true));
      if (job) {
        setJobForUploadedImage(job);
        setPollJobId(job.id);
      }
    }
  };

  // After a user has uploaded an image and thus started a job to generate a
  // thumbnail, we poll the job every second until it's done. This is mainly
  // done to keep the "Status" indicator up-to-date, as well as to display the
  // resulting thumbnail and allow download once the job is complete.
  useEffect(() => {
    const id = setInterval(async () => {
      if (pollJobId) {
        const job = await dispatch(getJob(pollJobId, true));
        if (job) {
          setJobForUploadedImage(job);
          if (job?.status === 'complete') clearInterval(id);
        } else clearInterval(id);
      } else {
        clearInterval(id);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [pollJobId]);

  if (isLoading) {
    console.log('home isLoading');
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
            <Grid item xs={12} marginBottom={3} container spacing={3} flexDirection='column'>
              <Grid item xs={12} className='Centered' style={{ maxWidth: '800px' }} flexDirection='column'>
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

              {jobForUploadedImage ? (
                <Grid
                  item
                  container
                  xs={12}
                  spacing={1}
                  className='Centered'
                  style={{ maxWidth: '1000px' }}
                  marginTop={5}>
                  <JobsTable
                    jobs={[jobForUploadedImage]}
                    title={t('routes.home.jobs_title')}
                    subtitle={t('routes.home.jobs_subtitle')}
                    includeCount={false}
                    deleteCallback={() => setJobForUploadedImage(null)}
                  />

                  <Grid item xs={12} className='LinkToJobs'>
                    <Link to='/jobs'>
                      See all jobs <ArrowRightIcon style={{ marginBottom: '-5px' }} />
                    </Link>
                  </Grid>
                </Grid>
              ) : (
                <Grid item xs={12} className='Centered LinkToJobs' marginTop={3} style={{ maxWidth: '800px' }}>
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
