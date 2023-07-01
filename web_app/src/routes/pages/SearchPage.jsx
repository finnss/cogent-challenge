import React from 'react';
import { Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '/style/searchpage.scss';

import Container from '../../components/Container';
import Search from '../../components/common/Search';
import BigSlashIcon from '../../components/icons/BigSlashIcon';

const SearchPage = () => {
  const { t } = useTranslation();

  return (
    <Container
      pageTitle={t('routes.search.page_title')}
      contentClassName='SearchPageContentContainer'
      pageClassName='SearchPagePageContainer'>
      <div className='SearchPage'>
        <Grid container spacing={1} className='OuterGridContainer'>
          <Grid item container xs={12} direction='row' className='GridContainer'>
            <div className='SlashIcon'>
              <BigSlashIcon />
            </div>

            <Grid item container xs={12} className='GridContainer'>
              <Grid item xs={12}>
                <Typography variant='h3' className='Welcome'>
                  {t('routes.search.welcome')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body1' className='Subtitle1'>
                  {t('routes.search.welcome_subtitle1')}
                </Typography>
              </Grid>
              <Grid item xs={12} style={{ marginTop: '8px' }}>
                <Typography variant='body1' className='Subtitle2'>
                  {t('routes.search.welcome_subtitle2')} <Link to='/persons/1'>Dummy link</Link>
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item container xs={12} className='SearchInputContainer'>
            <Search className='SearchPageSearch' inputClassName='SearchPageInput' />
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default React.memo(SearchPage);
