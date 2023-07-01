import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Modal from './Modal';
import '/style/help.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { submitFeedback } from '/modules/help';
import TextInput from '/components/forms/inputs/TextInput';
import { showToast } from '/modules/toast';

/**
 * View layer for feedback module
 * @returns {JSX.Element}
 */
function Feedback({ open, onClose }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toast = useSelector((state) => state.toast.toast);
  const {
    getValues,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: 'onChange',
  });

  const onSubmit = async () => {
    const success = await dispatch(submitFeedback(getValues()));
    if (success) dispatch(showToast(t('routes.help.feedback_sent')));
    onClose();
  };

  const actions = [
    { label: t('common.actions.cancel'), action: onClose, variant: 'text' },
    { label: t('routes.help.send_feedback'), action: handleSubmit(onSubmit), variant: 'contained' },
  ];

  return (
    <Modal title={t('routes.help.send_feedback')} open={open} onClose={onClose} actions={actions} width='sm'>
      <Grid container spacing={3} direction='column' className='FeedbackForm'>
        <Grid item xs={6}>
          <TextInput
            name='message'
            label={t('routes.help.feedback_message')}
            helperText={t('routes.help.feedback_message_desc')}
            fullWidth
            autoFocus
            multiline
            required
            minRows={6}
            control={control}
            errors={errors}
          />
        </Grid>
      </Grid>
    </Modal>
  );
}

Feedback.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Feedback;
