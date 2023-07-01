/* eslint-disable react/prop-types */
import { Button, Grid, MenuItem, Select, Typography } from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../style/image.scss';

import { useExitPagePrompt } from '../../util';
import Container from '../../components/Container';
import Loading from '../../components/common/Loading';
import Table from '../../components/table/Table';
import dayjs from 'dayjs';
import { showToast } from '/modules/toast';
import { getImage } from '/modules/images';

const DetailedImage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const { imageId } = useParams();

  const images = useSelector((state) => state.images.images);
  const isLoading = useSelector((state) => state.images.loading);

  const [currentImage, setCurrentImage] = useState();

  useExitPagePrompt(t('routes.home.confirm_navigation'), false);

  useEffect(() => {
    dispatch(getImage(imageId));
  }, [imageId]);

  useEffect(() => {
    if (images?.length > 0 && imageId) {
      setCurrentImage(images.find((i) => `${i.id}` === `${imageId}`));
    }
  }, [images, imageId]);

  if (isLoading) {
    return (
      <Container showErrorPage>
        <Loading />
      </Container>
    );
  }

  return (
    <Container
      pageTitle={t('routes.images.page_title')}
      contentClassName='ContentContainer'
      pageClassName='PageContainer'>
      <Grid className='ImagePage'>
        <Grid container className='OuterGridContainer'>
          <Grid item container xs={12} direction='row' className='GridContainer' spacing={3}>
            <Grid item xs={12}>
              <Typography variant='h4'>{t('routes.image.title')}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default React.memo(DetailedImage);
