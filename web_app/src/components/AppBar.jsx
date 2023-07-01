import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AppBar as MuiAppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Avatar, Button } from '@mui/material';
import { Help as HelpIcon, AutoGraph } from '@mui/icons-material';
import { logout } from '../modules/auth';
import HeaderSlashIcon from '/components/icons/HeaderSlashIcon';
import { nameInitials } from '../util';
import '../style/main.scss';
import { useTranslation } from 'react-i18next';
import HelpMenu from '/components/common/HelpMenu';

/**
 *
 * @param {object} anchor - The DOM-element from where the button was clicked
 * @param {Function} handleClose - Function to close the modal
 * @returns {JSX.Element} The user menu
 */
const UserMenu = ({ anchor, handleClose, currentUser }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <Menu
      anchorEl={anchor}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      keepMounted
      open={Boolean(anchor)}
      onClose={handleClose}>
      {currentUser && (
        <MenuItem className='UserButton' disableRipple>
          {currentUser.firstName} {currentUser.lastName}
        </MenuItem>
      )}
      <MenuItem onClick={() => dispatch(logout())}>{t('common.actions.logout')}</MenuItem>
    </Menu>
  );
};

/**
 *
 * @param {string} logoUrl - URL to the logo
 * @returns {JSX.Element} The Appbar
 */
const AppBar = ({ title, logoUrl }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [helpMenuAnchor, setHelpMenuAnchor] = useState(null);
  const [initialsForIcon, setInitialsForIcon] = useState('');

  useEffect(() => {
    const nameInitialsForIcon =
      isLoggedIn && currentUser ? nameInitials(currentUser.firstName, currentUser.lastName) : '?';
    setInitialsForIcon(nameInitialsForIcon);
  }, [isLoggedIn, currentUser]);

  const handleUserMenuOpen = (e) => {
    setUserMenuAnchor(e.currentTarget);
    handleHelpMenuClose();
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleHelpMenuOpen = (e) => {
    setHelpMenuAnchor(e.currentTarget);
    handleUserMenuClose();
  };

  const handleHelpMenuClose = () => {
    setHelpMenuAnchor(null);
  };

  const goHome = () => navigate('/');

  return (
    <>
      <MuiAppBar>
        <Toolbar disableGutters>
          <img className='Logo' src={logoUrl} onClick={goHome} />
          <HeaderSlashIcon className='SlashIcon' />
          <Typography className='Title' variant='h6'>
            {title}
          </Typography>
          {(currentUser?.permissions?.includes('statistics_read_personal') ||
            currentUser?.permissions?.includes('statistics_read_all')) && (
            <Button
              startIcon={<AutoGraph />}
              variant='contained'
              onClick={() => navigate('/statistics?tab=personal')}
              className='StatisticsButton'>
              {t('routes.statistics.page_title')}
            </Button>
          )}
          {currentUser?.permissions?.includes('help_read') && (
            <IconButton color='inherit' onClick={handleHelpMenuOpen} sx={{ mr: 1 }} size='large'>
              <HelpIcon fontSize='large' />
            </IconButton>
          )}
          <IconButton color='inherit' onClick={handleUserMenuOpen}>
            <Avatar sx={{ fontSize: 1.5 - 0.125 * initialsForIcon.length + 'rem' }}>{initialsForIcon}</Avatar>
          </IconButton>
        </Toolbar>
      </MuiAppBar>

      <HelpMenu anchor={helpMenuAnchor} handleClose={handleHelpMenuClose} />
      <UserMenu anchor={userMenuAnchor} handleClose={handleUserMenuClose} currentUser={currentUser} />
    </>
  );
};

AppBar.propTypes = {
  title: PropTypes.string,
  logoUrl: PropTypes.string,
};

UserMenu.propTypes = {
  anchor: PropTypes.object,
  handleClose: PropTypes.func,
  currentUser: PropTypes.object,
};

export default AppBar;
