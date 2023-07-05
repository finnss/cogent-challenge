import { Typography } from '@mui/material';

/**
 * The Bar to be shown on bottom of the page, showing client version.
 */
const Footer = () => (
  <div className='Footer'>
    <Typography variant='caption'>{`Client version: ${CLIENT_VERSION}`}</Typography>
  </div>
);

export default Footer;
