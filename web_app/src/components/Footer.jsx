import { Typography } from '@mui/material';

const Footer = () => (
  <div className='Footer'>
    {/* <Typography variant='caption'>{`Server: ${app.props?.versjon}`}</Typography> */}
    <Typography variant='caption'>{`Klient: ${CLIENT_VERSION}`}</Typography>
  </div>
);

export default Footer;