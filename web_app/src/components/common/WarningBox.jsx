import { memo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import '/style/warningbox.scss';
import ContentBox from './ContentBox';

const WarningBox = ({ sx, className, children }) => (
  <ContentBox className={clsx('WarningBox', className)} noPadding sx={sx || {}}>
    {children}
  </ContentBox>
);

WarningBox.propTypes = {
  sx: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.any.isRequired,
};

export default memo(WarningBox);
