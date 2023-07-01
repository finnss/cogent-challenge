import { memo, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Grid, Button } from '@mui/material';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { fregLookup } from '../../modules/search';
import { registerPerson, updatePerson } from '../../modules/persons';
import Modal from '../common/Modal';
import TextInput from './inputs/TextInput';
import DateInput from './inputs/DateInput';
import SelectInput from './inputs/SelectInput';
import { GENDERS, useKeyPress } from '../../util';
import { capitalize } from '../../util/formatters';

const emptyPerson = {
  personNr: '',
  fullName: '',
  // FIXME Not sure if this birthDate makes sense? Having it empty leads to validation failing from start,
  // but we could fix that. I just thought 1990 might be easier to start from than 2023, but it
  // introduces the risk of someone forgetting to update this and ending up with a lot of persons born
  // Jan 01 1990.. (finnss)
  birthDate: null,
  gender: null,
  streetAddress: '',
  postArea: '',
};

/**
 * Form with inputs for Person info.
 * @param {{ defaultValues, open: bool, onClose: func, className: string, onSuccess: func }}
 * @returns {JSX.Element} - PersonFormModal
 */
const PersonFormModal = ({ defaultValues, open, onClose, className, onSuccess }) => {
  const dispatch = useDispatch();
  const fregResults = useSelector((state) => state.search.fregResults);
  const { t } = useTranslation();
  const initialFormValues = defaultValues ? { ...emptyPerson, ...defaultValues } : emptyPerson;
  const {
    getValues,
    setValue,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    setFocus,
    watch,
  } = useForm({
    defaultValues: initialFormValues,
    mode: 'onChange',
  });

  // The initial values *should* be set properly in the form using useForm({ defaultValues }), but just in case
  // there is some mishap with rendering order, loading, etc, we make sure the values from the `defaultValues` prop
  // are set properly in the form here.
  useEffect(() => {
    if (defaultValues) Object.keys(defaultValues).map((key) => setValue(key, defaultValues[key]));

    if (defaultValues?.lastName && open) {
      setValue('fullName', ` ${defaultValues.lastName}`);
      setFocus('fullName');
    }
  }, [defaultValues, open]);

  const onSubmit = async (values) => {
    const newPerson = values || getValues();
    // Trim all strings
    Object.keys(newPerson).forEach((key) => {
      if (typeof newPerson[key] === 'string') newPerson[key] = newPerson[key].trim();
    });
    if (defaultValues?.id) newPerson.id = defaultValues?.id;
    const personFromBackend = newPerson?.id
      ? await dispatch(updatePerson(newPerson))
      : await dispatch(registerPerson(newPerson));
    if (personFromBackend && personFromBackend.id) onSuccess(personFromBackend.id);
  };
  useKeyPress('Enter', open ? handleSubmit(onSubmit) : () => {}, [handleSubmit, onSubmit]);

  const watchPersonNr = watch('personNr');

  const [shouldPopulateFromFreg, setShouldPopulateFromFreg] = useState(false);
  const getInfoFromFreg = () => {
    setShouldPopulateFromFreg(true);
    dispatch(fregLookup(watchPersonNr));
  };

  // This useEffect listens to the results from FREG, and if detected, inserts them into the form.
  // The 'shouldPopulateFromFreg' state is needed in case there are already FREG results available on first load.
  useEffect(() => {
    if (shouldPopulateFromFreg) {
      if (fregResults && fregResults?.personNr === watchPersonNr) {
        reset(fregResults);
      }
    }
  }, [fregResults, shouldPopulateFromFreg, watchPersonNr]);

  const onCloseModal = () => {
    setShouldPopulateFromFreg(false);
    reset(emptyPerson);
    onClose();
  };

  const modalActions = useMemo(
    () => [
      {
        label: t('common.actions.cancel'),
        action: onCloseModal,
        variant: 'text',
      },
      {
        label: defaultValues && defaultValues.id ? t('common.actions.update') : t('common.actions.register'),
        action: handleSubmit(onSubmit),
        variant: 'contained',
      },
    ],
    [defaultValues, handleSubmit, onSubmit, reset, onClose]
  );

  return (
    <Modal
      title={
        defaultValues?.id
          ? t('routes.persons.update_person_form_title')
          : t('routes.persons.register_person_form_title')
      }
      open={open}
      onClose={onCloseModal}
      actions={modalActions}
      className={className}>
      <Grid container spacing={3}>
        <Grid item container xs={12} spacing={1}>
          <TextInput
            name='personNr'
            label={t('routes.persons.person_nr')}
            control={control}
            errors={errors}
            sx={{ maxWidth: '75%' }}
            gridStyle={{ flexDirection: 'row' }}
            validation={{ minLength: 11, maxLength: 11 }}
          />

          <Grid item xs={12}>
            <Button
              variant='outlined'
              startIcon={<SubdirectoryArrowRightIcon />}
              onClick={getInfoFromFreg}
              disabled={!watchPersonNr || watchPersonNr.length !== 11}>
              {t('routes.persons.get_from_freg')}
            </Button>
          </Grid>
        </Grid>

        <TextInput
          name='fullName'
          label={t('routes.persons.full_name')}
          control={control}
          errors={errors}
          gridStyle={{ flexDirection: 'row' }}
          required
          validation={{
            // This regex matches strings with minimum 2 names, separated by whitespaces.
            // A name is a string of any length containing only letters A-Å or dash '-'.
            // Surrounding whitecases are also allowed to avoid confusion - these are trimmed later anyway.
            pattern: { value: /^[-\s]*[A-Åa-å]+(?:[-\s][A-Åa-å]+)+[-\s]*$/i, message: t('errors.full_name') },
          }}
        />

        <DateInput
          name='birthDate'
          label={t('routes.persons.birth_date')}
          control={control}
          errors={errors}
          helperText={t('routes.persons.birth_date_helper')}
          openTo='year'
        />

        <SelectInput
          name='gender'
          label={t('routes.persons.gender')}
          options={GENDERS}
          control={control}
          errors={errors}
          gridStyle={{ flexDirection: 'row' }}
          renderValue={(value) => capitalize(t('common.strings.gender', { gender: value }))}
        />

        <TextInput
          name='streetAddress'
          label={t('routes.persons.street_address')}
          control={control}
          errors={errors}
          gridStyle={{ flexDirection: 'row' }}
        />

        <TextInput
          name='postArea'
          label={t('routes.persons.post_area')}
          control={control}
          errors={errors}
          gridStyle={{ flexDirection: 'row' }}
        />
      </Grid>
    </Modal>
  );
};

PersonFormModal.propTypes = {
  defaultValues: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
  onSuccess: PropTypes.func.isRequired,
};

PersonFormModal.defaultProps = {
  className: '',
};

export default memo(PersonFormModal);
