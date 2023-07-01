import { memo } from 'react';
import { CircularProgress, Typography, Box } from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import '/style/loading.scss';

/**
 * Displays loading indicator
 * @param {{ className: string, text: string, noText: boolean, size: number, sx: import('@mui/system').SxProps}}
 * @returns {JSX.Element}
 */
const Loading = ({ className, text, noText, size, sx, color }) => {
  const { t } = useTranslation();

  return (
    <Box className={clsx('Loading', className)} sx={sx}>
      <CircularProgress color={color} size={size} />
      {!noText && <Typography>{text || t('common.states.loading')}</Typography>}
    </Box>
  );
};

Loading.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
  noText: PropTypes.bool,
  size: PropTypes.number,
  sx: PropTypes.object,
  color: PropTypes.string,
};

Loading.defaultProps = {
  className: null,
  sx: {},
  color: 'interactive',
  noText: false,
  size: 45,
};

export default memo(Loading);
