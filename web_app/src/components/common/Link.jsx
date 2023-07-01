import { memo } from 'react';
import PropTypes from 'prop-types';
import { Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Displays a React router Link inside a MUI-styled Link
 * @param {{ to: string className: string, sx: import('@mui/system').SxProps}}
 * @returns {JSX.Element}
 */
const Link = ({ to, className, sx, children, style, onClick }) => (
  <MuiLink to={to} className={className} sx={sx} style={style} onClick={onClick} component={RouterLink}>
    {children}
  </MuiLink>
);

Link.propTypes = {
  to: PropTypes.string,
  className: PropTypes.string,
  sx: PropTypes.object,
  style: PropTypes.object,
  children: PropTypes.any,
  onClick: PropTypes.func,
};

Link.defaultProps = {
  className: null,
  sx: {},
  style: {},
};

export default memo(Link);
