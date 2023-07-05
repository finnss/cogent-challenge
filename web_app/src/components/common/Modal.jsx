/* eslint-disable react/prop-types */
import { memo } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Box, Divider } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import '/style/modal.scss';
import clsx from 'clsx';

const doNothing = () => false;

function Modal({ className, title, actions, open, onClose, width, disableClose, children }) {
  return (
    <Dialog
      className={clsx('Modal', className)}
      open={open}
      onClose={disableClose ? doNothing : onClose}
      maxWidth={width}
      fullWidth
      disableEscapeKeyDown={disableClose}
      onBackdropClick={disableClose ? doNothing : onClose}>
      <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
        <CloseIcon fontSize='medium' color='primary' />
      </IconButton>
      {title && <DialogTitle sx={{ fontSize: '2.5rem' }}>{title}</DialogTitle>}
      <DialogContent>
        <Box sx={{ pt: 1 }}>{children}</Box>
      </DialogContent>
      {actions && (
        <DialogActions>
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant ?? 'outlined'}
              color={action.color ?? 'interactive'}
              onClick={action.action}
              disabled={Boolean(action.disabled)}
              startIcon={action.icon ? <action.icon /> : null}>
              {action.label}
            </Button>
          ))}
        </DialogActions>
      )}
    </Dialog>
  );
}

Modal.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  actions: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool,
  onClose: PropTypes.func,
  width: PropTypes.string,
  disableClose: PropTypes.bool,
};

Modal.defaultProps = {
  className: null,
  open: true,
  width: 'md',
  disableClose: false,
};

export default memo(Modal);
