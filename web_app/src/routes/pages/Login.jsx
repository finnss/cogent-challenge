import { useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { Paper, Avatar, Typography, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { LockOutlined } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useKeyPress } from '/util';
import { defaultLogger as log } from '/logger';
import '/style/login.scss';
import { login, logout } from '../../modules/auth';
import Toast from '/components/Toast';

/**
 * View layer for login module
 * @returns {JSX.Element}
 */
function Login() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const passwordField = useRef();
  const { t } = useTranslation();

  const onLogin = useCallback(async () => {
    try {
      setLoading(true);
      const success = await dispatch(login(username, password));

      // Reset password field if login failed
      if (!success && passwordField.current) {
        passwordField.current.value = '';
        passwordField.current.focus();
      }
    } finally {
      setLoading(false);
    }
  }, [username, password]);

  useKeyPress('Enter', onLogin, [onLogin]);

  return (
    <>
      <Paper component='form' className='LoginContainer'>
        <Avatar className='avatar'>
          <LockOutlined />
        </Avatar>
        <Typography className='text' variant='h5'>
          ALFA
        </Typography>
        <TextField
          required
          fullWidth
          margin='normal'
          label={t('brukernavn')}
          autoFocus
          autoComplete='off'
          onChange={(e) => setUsername(e.target.value)}
          size='medium'
          disabled={loading}
        />
        <TextField
          inputRef={passwordField}
          required
          fullWidth
          margin='normal'
          label={t('passord')}
          type='password'
          autoComplete='off'
          onChange={(e) => setPassword(e.target.value)}
          size='medium'
          disabled={loading}
        />
        <LoadingButton
          className='loginBtn'
          fullWidth
          variant='contained'
          size='large'
          onClick={onLogin}
          loading={loading}>
          {t('login')}
        </LoadingButton>
      </Paper>
      <Toast />
    </>
  );
}

function LoginWrapper() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const location = useLocation();

  // If the user was redirected to Login by ProtectedRoute, then
  // redirect back to the original page after logged in, else
  // redirect to homepage
  if (isLoggedIn) {
    const redirect = location?.state?.from || '/';
    if (redirect !== '/login') {
      log.info('redirect to ', redirect);
      return <Navigate to={redirect} state={{ from: 'login' }} />;
    } else {
      log.error('redirect is /login. please fix homepage function');
      dispatch(logout());
    }
  }

  return <Login />;
}

export default LoginWrapper;
