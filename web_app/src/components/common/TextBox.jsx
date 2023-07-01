import { memo } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import ContentBox from '/components/common/ContentBox';

/**
 * Displays text in contentbox
 * @returns {JSX.Element}
 */
const TextBox = ({ title, emptyText, children, ...rest }) => (
  <ContentBox title={title} {...rest}>
    <Typography
      whiteSpace='break-spaces'
      fontStyle={children.length > 0 ? 'inherit' : 'italic'}
      fontWeight={children.length > 0 ? 'inherit' : '300'}>
      {children.length > 0 ? children : emptyText}
    </Typography>
  </ContentBox>
);

TextBox.propTypes = {
  title: PropTypes.string.isRequired,
  emptyText: PropTypes.string,
  children: PropTypes.string,
};

TextBox.defaultProps = {
  emptyText: '',
  children: '',
};

export default memo(TextBox);
