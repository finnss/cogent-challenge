import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AppBar as MuiAppBar, Toolbar, Typography } from '@mui/material';
import '../style/main.scss';

/**
 * The Bar to be shown on top of the page, including the Logo and page title.
 */
const AppBar = ({ title, logoUrl }) => {
  const navigate = useNavigate();
  const goHome = () => navigate('/');

  return (
    <>
      <MuiAppBar>
        <Toolbar disableGutters>
          <div className='LogoContainer'>
            <img className='Logo' src={logoUrl} onClick={goHome} />
          </div>
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
