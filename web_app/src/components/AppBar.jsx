import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AppBar as MuiAppBar, Toolbar, Typography } from '@mui/material';
import '../style/main.scss';

/**
 *
 * @param {string} logoUrl - URL to the logo
 * @returns {JSX.Element} The Appbar
 */
const AppBar = ({ title, logoUrl }) => {
  const navigate = useNavigate();
  const goHome = () => navigate('/');

  return (
    <>
      <MuiAppBar>
        <Toolbar disableGutters>
          <img className='Logo' src={logoUrl} onClick={goHome} />
          <Typography className='Title' variant='h6'>
            {title}
          </Typography>
        </Toolbar>
      </MuiAppBar>
    </>
  );
};

AppBar.propTypes = {
  title: PropTypes.string,
  logoUrl: PropTypes.string,
};

export default AppBar;
