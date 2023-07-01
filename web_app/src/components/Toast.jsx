import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, Snackbar } from '@mui/material';
import { dismissToast } from '/modules/toast';
import '/style/toast.scss';

const Toast = () => {
  const dispatch = useDispatch();
  const toastOpts = useSelector((state) => state.toast.toast);

  const onClose = () => dispatch(dismissToast());

  return (
    <Snackbar
      open={toastOpts.open}
      autoHideDuration={toastOpts.duration === -1 ? null : toastOpts.duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      className='ToastContainer'>
      <Alert onClose={onClose} severity={toastOpts.variant} variant='filled'>
        {toastOpts.message}
      </Alert>
    </Snackbar>
  );
};

export default React.memo(Toast);
