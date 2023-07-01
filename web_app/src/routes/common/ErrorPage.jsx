import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { memo } from 'react';
import { Typography } from '@mui/material';

/**
 * Error page is rendered by Container when the errorHandler module sets the 'errorStatusForPage'
 * redux state. In addition, to make sure we don't interrupt an user's experience whenever the
 * backend returns any error, an error page is only rendered if the error occurs just as the user navigates
 * to the page. This is (attempted?) achieved by using the "showErrorPage" flag, and only setting it true
 * in the Container surrounding the "Loading" component on each route.
 * @returns {JSX.Element}
 */
const ErrorPage = ({ statusCode }) => {
  const { t } = useTranslation();

  return (
    <div className='ErrorPage'>
      <Typography variant='h6'>{t(`common.states.text_${statusCode}`)}</Typography>
      <Typography variant='body' className='WeakText'>
        {t(`common.states.desc_${statusCode}`)}
      </Typography>
    </div>
  );
};

ErrorPage.propTypes = {
  statusCode: PropTypes.any,
};

export default memo(ErrorPage);
