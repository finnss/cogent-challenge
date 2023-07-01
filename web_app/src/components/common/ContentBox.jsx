import { memo } from 'react';
import { Typography, Box } from '@mui/material';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import '/style/contentbox.scss';

/**
 * Container that wraps content in a Paper with caption
 * @param {{ title: string, sx: import('@mui/system').SxProps, className: string, noPadding: boolean, noBorder: boolean }}
 * @returns {JSX.Element}
 */
const ContentBox = ({ title, sx, className, noPadding, noBorder, endComponent, children }) => (
  <Box className={clsx('ContentBox', className)} sx={sx}>
    {title && (
      <div className='ContentTitle'>
        <Typography>{title}</Typography>
        {endComponent}
      </div>
    )}
    <div className={clsx('ContentBody', noPadding ? 'NoPadding' : null, noBorder ? 'NoBorder' : null)}>{children}</div>
  </Box>
);

ContentBox.propTypes = {
  title: PropTypes.string,
  sx: PropTypes.object,
  className: PropTypes.string,
  noPadding: PropTypes.bool,
  noBorder: PropTypes.bool,
  children: PropTypes.node,
  endComponent: PropTypes.node,
};

ContentBox.defaultProps = {
  sx: { flexGrow: 1 },
  noPadding: false,
  noBorder: false,
  endComponent: null,
};

export default memo(ContentBox);
