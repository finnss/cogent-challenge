import { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField, Button, IconButton, Paper, Typography } from '@mui/material';
import {
  Save as SaveIcon,
  DeleteOutlined as DeleteIcon,
  VisibilityOutlined as VisibilityIcon,
} from '@mui/icons-material';
import { marked } from 'marked';
import { sanitize } from 'dompurify';
import clsx from 'clsx';
import '/style/help.scss';
import { useTranslation } from 'react-i18next';
import Modal from '/components/common/Modal';
import { useForm } from 'react-hook-form';
import TextInput from '/components/forms/inputs/TextInput';

/**
 * Form with inputs for Help page info.
 * @param {{ form: any, errors: any, helpPage: object, onSave: Function, onDelete: Function }}
 * @returns {JSX.Element}
 */
function HelpAdminForm({ helpPage, onSave, onDelete, isFormPristine, setIsFormPristine }) {
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  const [wasSetPristine, setWasSetPristine] = useState(false);
  const { t } = useTranslation();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const {
    getValues,
    reset,
    setFocus,
    control,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: 'onBlur',
  });

  const onSubmit = () => {
    onSave({ ...getValues(), slug: helpPage.slug });
  };

  // This useEffect should only trigger when a new help page is selected to be edited (or created) from the menu.
  // All the code in the useEffect is for resetting the state of the entire component.
  useEffect(() => {
    setIsFormPristine(true);
    setWasSetPristine(false);

    const isNew = helpPage?.title === t('routes.help.new_help');
    const startValues = { ...helpPage, title: isNew || !helpPage?.title ? '' : helpPage.title };
    reset(startValues);

    if (isNew || helpPage?.title === '') {
      setFocus('title');
    } else {
      setFocus('content');
    }
  }, [helpPage]);

  const watchTitle = watch('title');
  const watchDescription = watch('description');
  const watchContent = watch('content');

  // This useEffect is used to show a popup asking if the user wants to discard their changes
  // if they navigate away from a page before saving. The logic is used to try making sure it
  // is only showed when actual changes have been made.
  useEffect(() => {
    const anyValueWasChanged =
      helpPage &&
      ((watchTitle && watchTitle !== helpPage.title) ||
        (watchDescription && watchDescription !== helpPage.description) ||
        (watchContent && watchContent !== helpPage.content));

    if (anyValueWasChanged && isFormPristine && !wasSetPristine) {
      setIsFormPristine(false);
      setWasSetPristine(true);
    }
  }, [isFormPristine, setIsFormPristine, wasSetPristine, helpPage, watchContent, watchTitle, watchDescription]);

  return (
    <Grid container spacing={4} direction='column' className='HelpAdminForm'>
      <Grid item xs={1}>
        <TextInput
          name='title'
          label={t('routes.help.title')}
          helperText={t('routes.help.title_help')}
          fullWidth
          autoFocus
          required
          control={control}
          errors={errors}
        />
      </Grid>
      <Grid item xs={1}>
        <TextInput
          name='description'
          label={t('routes.help.description')}
          helperText={t('routes.help.description_help')}
          fullWidth
          required
          control={control}
          errors={errors}
        />
      </Grid>
      <Grid item xs={6}>
        {showMarkdownPreview ? (
          <Paper className='HelpAdminMarkdownPreview'>
            <Typography variant='h6' className='HelpAdminMarkdownTitle'>
              {t('routes.help.preview')}
            </Typography>
            <div
              className='HelpAdminMarkdownContent'
              dangerouslySetInnerHTML={{
                __html: sanitize(marked(watchContent || t('routes.help.nothing'))),
              }}
            />
          </Paper>
        ) : (
          <TextInput
            name='content'
            label={t('routes.help.content')}
            helperText={t('routes.help.content_help')}
            required
            fullWidth
            multiline
            control={control}
            errors={errors}
            minRows={8}
          />
        )}

        <div className='HelpAdminContentButtons'>
          <IconButton onClick={() => setShowConfirmDelete(true)} className='HelpAdminIconButton'>
            <DeleteIcon />
          </IconButton>

          <IconButton
            onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
            className={clsx('HelpAdminIconButton', showMarkdownPreview && 'HelpAdminButtonActive')}>
            <VisibilityIcon />
          </IconButton>

          <Button variant='contained' startIcon={<SaveIcon />} onClick={handleSubmit(onSubmit)} type='submit'>
            {t('common.actions.save')}
          </Button>
        </div>
      </Grid>

      <Modal
        title={t('routes.help.delete_confirmation_title')}
        open={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        actions={[
          {
            label: t('routes.help.delete_confirmation_no'),
            action: () => setShowConfirmDelete(false),
            variant: 'text',
          },
          {
            label: t('routes.help.delete_confirmation_yes'),
            action: () => onDelete(),
            variant: 'contained',
          },
        ]}
        className='ConfirmModal'>
        <Typography variant='body2'>{t('routes.assessments.steps.1.cancel_confirmation')}</Typography>
      </Modal>
    </Grid>
  );
}

HelpAdminForm.propTypes = {
  helpPage: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  isFormPristine: PropTypes.bool.isRequired,
  setIsFormPristine: PropTypes.func.isRequired,
};

export default memo(HelpAdminForm);
