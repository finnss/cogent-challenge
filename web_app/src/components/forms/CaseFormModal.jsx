import { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, Button, Typography } from '@mui/material';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import '/style/caseform.scss';

import { fregLookup } from '/modules/search';
import { addCase } from '/modules/cases';
import { capitalize, formatDate, formatPersonNr } from '/util/formatters';
import Modal from '../common/Modal';
import TextInput from './inputs/TextInput';
import DateInput from './inputs/DateInput';
import SelectInput from './inputs/SelectInput';
import { GENDERS, useKeyPress } from '../../util';
import { getDetailedPerson, registerPerson, updatePerson } from '../../modules/persons';
import ApiError from '../../api/apiError';
import dayjs from 'dayjs';
import { getDistricts } from '/modules/districts';

const emptyCase = {
  aggressor: { personNr: '', fullName: '', birthDate: null, gender: null, streetAddress: '', postArea: '' },
  victim: { personNr: '', fullName: '', birthDate: null, gender: null, streetAddress: '', postArea: '' },
  districtId: null,
  geographicalUnitId: null,
};

/**
 * Form with inputs for Case info.
 * @param {{ caseId: string, defaultValues, open: bool, onClose: func, className: string, onSuccess: func }}
 * @returns {JSX.Element} - CaseFormModal
 */
const CaseFormModal = ({ existingPerson, defaultRole, defaultValues, open, onClose, className, onSuccess }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const districts = useSelector((state) => state.districts.districts);
  const [existingPersonRole, setExistingPersonRole] = useState(defaultRole);
  const [showConflictingPersonInfoError, setShowConflictingPersonInfoError] = useState(false);
  const [conflictingPersonForError, setConflictingPersonForError] = useState();
  const [userChoseNewInfo, setUserChoseNewInfo] = useState();
  const [geographicalUnitOptions, setGeographicalUnitOptions] = useState([]);
  const {
    getValues,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues || existingPerson ? { ...emptyCase, [defaultRole]: existingPerson } : emptyCase,
    mode: 'onBlur',
  });

  useEffect(() => {
    dispatch(getDistricts());
  }, []);

  // This useEffect is responsible for swapping the contents of the form from left to right (and reverse) when
  // the user clicks "Aggressor" or "Victim" to change which role the pre-existing person will have in the case.
  useEffect(() => {
    const { aggressor, victim } = getValues();
    if (existingPersonRole === 'aggressor' && !existingPerson.personNr !== aggressor?.personNr) {
      setValue('victim', aggressor?.personNr !== existingPerson.personNr ? aggressor : emptyCase.victim);
      setValue('aggressor', existingPerson);
      clearErrors();
    } else if (existingPersonRole === 'victim' && !existingPerson.personNr !== victim?.personNr) {
      setValue('aggressor', victim?.personNr !== existingPerson.personNr ? victim : emptyCase.aggressor);
      setValue('victim', existingPerson);
      clearErrors();
    }
  }, [existingPerson, existingPersonRole]);

  // When submitting a new case, one of the two persons involved will have been filled in by the user
  // through this form. The other will already exist in the database (exisistingUser).
  // The API expects both persons to already exist in the database, so we need to first submit the
  // filled-in person.
  // In the case that this secondary person also happens to exists in the database, we will run into a 409
  // CONFLICT error. We handle this by checking if the backend values exactly match the newly filled-in ones;
  // if so, simply proceed with that user. If not, we display a prompt where the user has to decide which values to use.
  const onSubmit = async (values) => {
    const newCase = values || getValues();
    const personToRegister = existingPersonRole === 'aggressor' ? newCase.victim : newCase.aggressor;

    // Trim all strings
    Object.keys(personToRegister).forEach((key) => {
      if (typeof personToRegister[key] === 'string') personToRegister[key] = personToRegister[key].trim();
    });

    let secondaryPersonOk = true;
    let secondaryPersonDB;

    // This is the first time "Submit" is pressed.
    if (!userChoseNewInfo) {
      try {
        secondaryPersonDB = await dispatch(registerPerson(personToRegister, true));
      } catch (error) {
        if (error instanceof ApiError && error?.status === 409) {
          console.warn('Person submitted as part of a new case already exists.');
          const errorMsgParts = error?.message?.split(' ');
          const idOfConflictingPerson = errorMsgParts && Number(errorMsgParts[errorMsgParts.length - 1]);
          if (idOfConflictingPerson) {
            const backendValuesForSecondaryPerson = await dispatch(getDetailedPerson(idOfConflictingPerson, true));
            const allFieldsMatch = checkIfAllFieldsMatch(personToRegister, backendValuesForSecondaryPerson);

            if (allFieldsMatch) {
              secondaryPersonDB = backendValuesForSecondaryPerson;
            } else {
              setConflictingPersonForError(backendValuesForSecondaryPerson);
              setShowConflictingPersonInfoError(true);
              secondaryPersonOk = false;
            }
          } else {
            console.error("Backend didn't report id of conflicting person. FIXME Use backup solution of search here?");
          }
        }
      }
    }

    // There was already a conflict between the provided data and the submitted data, and the user chose to
    // use new data. Submit whatever is in the form.
    else if (userChoseNewInfo === 'new') {
      secondaryPersonDB = await dispatch(
        updatePerson({ ...personToRegister, id: conflictingPersonForError?.id }, true)
      );
    }

    // There was already a conflict between the provided data and the submitted data, and the user chose to
    // use old data. Before proceding to creating a case between the two existing persons, re-check that
    // the from values still match the backend values for the secondary person (they could have been modified
    // between "Submit" button presses).
    else if (userChoseNewInfo === 'old') {
      const allFieldsMatch = checkIfAllFieldsMatch(personToRegister, conflictingPersonForError);

      if (allFieldsMatch) {
        secondaryPersonDB = conflictingPersonForError;
      } else {
        setShowConflictingPersonInfoError(true);
        secondaryPersonOk = false;
        setUserChoseNewInfo(undefined);
      }
    }

    // All checks of the form values ok. Proceed to actually creating the case.
    if (secondaryPersonOk && secondaryPersonDB) {
      creaseCaseBackend(newCase, secondaryPersonDB);
    }
  };

  const checkIfAllFieldsMatch = (formValues, backendValuesForSecondaryPerson) => {
    const birthDatesEqual =
      dayjs(backendValuesForSecondaryPerson.birthDate)
        .hour(0)
        .minute(0)
        .second(0)
        .diff(dayjs(formValues.birthDate).hour(0).minute(0).second(0)) === 0;

    const fieldsToMatch = ['fullName', 'gender', 'streetAddress', 'postArea'];
    const allFieldsMatch =
      birthDatesEqual &&
      fieldsToMatch.filter(
        (key) => Object.keys(formValues).includes(key) && formValues[key] === backendValuesForSecondaryPerson[key]
      ).length === fieldsToMatch.length;
    return allFieldsMatch;
  };

  const creaseCaseBackend = async (newCase, secondaryPersonDB) => {
    newCase.aggressorId = existingPersonRole === 'aggressor' ? existingPerson.id : secondaryPersonDB.id;
    newCase.victimId = existingPersonRole === 'victim' ? existingPerson.id : secondaryPersonDB.id;
    const createdCase = await dispatch(addCase(newCase, true));
    if (createdCase?.id) onSuccess(createdCase.id);
  };

  useKeyPress('Enter', open ? handleSubmit(onSubmit) : () => {}, [handleSubmit, onSubmit]);

  const getInfoFromFreg = async (role) => {
    const personNr = getValues()[role].personNr;
    if (!personNr || personNr.length !== 11) {
      setError(`${role}.personNr`, { type: 'required_for_freg' }, true);
    }

    const fregResults = await dispatch(fregLookup(personNr));
    // FIXME We shouldnt need this personNr override when freg search is implemented properly
    if (fregResults) {
      setValue(role, { ...fregResults, personNr });
      clearErrors();
    }
  };

  const watchDistrictId = watch('districtId'); // Listen to district id updates
  const districtIds = useMemo(() => districts?.map((d) => d.id), [districts]);

  useEffect(() => {
    const unitOptionsForNewDistrict =
      districts?.find((district) => district.id === watchDistrictId)?.geographicalUnits?.map((u) => u.id) || [];
    setGeographicalUnitOptions(unitOptionsForNewDistrict);
    setValue('geographicalUnitId', unitOptionsForNewDistrict[0] || '');
  }, [watchDistrictId]);

  const renderDistrictValue = (value) => {
    const district = districts?.find((d) => d.id === value);
    return district ? `${district.id} ${district.name}` : '';
  };
  const renderGeographicalUnitValue = (value) =>
    districts?.find((d) => d.id === watchDistrictId)?.geographicalUnits?.find((u) => u.id === value)?.name;

  const onCloseModal = () => {
    setShowConflictingPersonInfoError(false);
    setConflictingPersonForError(undefined);
    setUserChoseNewInfo(undefined);
    setExistingPersonRole('victim');
    reset({
      ...emptyCase,
      victim: existingPerson,
      aggressor: emptyCase.aggressor,
    });
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
        disabled:
          (errors && errors.length > 0) ||
          errors['aggressor']?.length > 0 ||
          errors['victim']?.length > 0 ||
          showConflictingPersonInfoError,
      },
    ],
    [defaultValues, handleSubmit, onSubmit, reset, errors, showConflictingPersonInfoError, onClose]
  );

  const conflictingUserInfoError = useMemo(
    () => (
      <Grid item container xs={12} spacing={4}>
        <Grid item xs={12}>
          <Typography className='ConflictingError'>{t('routes.cases.person_exists_error')}</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography className=''>
            {t('routes.persons.person_nr')}: {formatPersonNr(conflictingPersonForError?.personNr)}
          </Typography>
          <Typography className=''>
            {t('routes.persons.full_name')}: {conflictingPersonForError?.fullName}
          </Typography>
          <Typography className=''>
            {t('routes.persons.birth_date')}: {formatDate(conflictingPersonForError?.birthDate)}
          </Typography>
          <Typography className=''>
            {t('routes.persons.gender')}: {capitalize(conflictingPersonForError?.gender)}
          </Typography>
          <Typography className=''>
            {t('routes.persons.address')}:{' '}
            {`${conflictingPersonForError?.streetAddress} ${conflictingPersonForError?.postArea}`}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography className='ConflictingError'>{t('routes.cases.person_exists_question')}</Typography>
        </Grid>

        <Grid item xs={12} container>
          <Button
            variant='contained'
            style={{ marginBottom: '8px' }}
            onClick={() => {
              setUserChoseNewInfo('new');
              setShowConflictingPersonInfoError(false);
            }}>
            {t('routes.cases.choose_new')}
          </Button>
          <Button
            variant='outlined'
            onClick={() => {
              setUserChoseNewInfo('old');
              setValue(existingPersonRole === 'aggressor' ? 'victim' : 'aggressor', conflictingPersonForError);
              setShowConflictingPersonInfoError(false);
            }}>
            {t('routes.cases.choose_old')}
          </Button>
        </Grid>
      </Grid>
    ),
    [conflictingPersonForError]
  );

  return (
    <Modal
      title={t('routes.cases.register_case_form_title')}
      open={open}
      onClose={onCloseModal}
      actions={modalActions}
      className={clsx('CaseForm', className)}>
      <Grid container spacing={3}>
        <Grid item xs={12} className='RolePicker'>
          <Typography className='WeakText'>
            {t('routes.cases.form_role', { name: existingPerson?.fullName })}
          </Typography>
          <Button
            variant='outlined'
            onClick={() => setExistingPersonRole('aggressor')}
            className={`RolePickerButton RightButton${existingPersonRole === 'aggressor' ? ' ActiveButton' : ''}`}>
            {t('common.strings.aggressor')}
          </Button>
          <Button
            variant='outlined'
            onClick={() => setExistingPersonRole('victim')}
            className={`RolePickerButton LeftButton${existingPersonRole === 'victim' ? ' ActiveButton' : ''}`}>
            {t('common.strings.victim')}
          </Button>
        </Grid>

        <Grid item container xs={12} spacing={3} direction='row' className='PersonsContainer'>
          <PersonFormHalf
            role='aggressor'
            existingPersonRole={existingPersonRole}
            getInfoFromFreg={getInfoFromFreg}
            showConflictingPersonInfoError={showConflictingPersonInfoError}
            conflictingUserInfoError={conflictingUserInfoError}
            className='LeftHalf'
            control={control}
            errors={errors}
          />
          <PersonFormHalf
            role='victim'
            existingPersonRole={existingPersonRole}
            getInfoFromFreg={getInfoFromFreg}
            showConflictingPersonInfoError={showConflictingPersonInfoError}
            conflictingUserInfoError={conflictingUserInfoError}
            className='RightHalf'
            control={control}
            errors={errors}
          />
        </Grid>

        <Grid item container xs={12} direction='row' spacing={1}>
          <Grid item xs={12}>
            <Typography variant='h6'>{t('routes.cases.district_and_gde')}</Typography>
          </Grid>

          <Grid item container xs={12} spacing={3} direction='row'>
            <SelectInput
              name='districtId'
              label={t('common.strings.district')}
              options={districtIds}
              renderValue={renderDistrictValue}
              control={control}
              errors={errors}
              fullWidth={false}
              selectProps={{ style: { width: '300px' } }}
              gridStyle={{ width: 'fit-content', flexDirection: 'column' }}
              xs={6}
              required
            />

            <SelectInput
              name='geographicalUnitId'
              label={t('common.strings.geographical_unit')}
              options={geographicalUnitOptions}
              renderValue={renderGeographicalUnitValue}
              control={control}
              errors={errors}
              fullWidth={false}
              disabled={
                !watchDistrictId ||
                watchDistrictId === '' ||
                !geographicalUnitOptions ||
                geographicalUnitOptions.length === 0
              }
              selectProps={{ style: { width: '200px' } }}
              gridStyle={{ width: 'fit-content', flexDirection: 'column' }}
              xs={6}
              required
            />
          </Grid>
        </Grid>
      </Grid>
    </Modal>
  );
};

CaseFormModal.propTypes = {
  existingPerson: PropTypes.object.isRequired,
  defaultRole: PropTypes.string,
  defaultValues: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
  onSuccess: PropTypes.func.isRequired,
};

CaseFormModal.defaultProps = {
  className: '',
  defaultRole: 'victim',
};

const PersonFormHalf = ({
  role,
  existingPersonRole,
  getInfoFromFreg,
  showConflictingPersonInfoError,
  conflictingUserInfoError,
  className,
  control,
  errors,
}) => {
  const { t } = useTranslation();

  return (
    <Grid item container xs={6} className={className} spacing={2}>
      <Grid item xs={12} style={{ paddingTop: 0 }}>
        <Typography variant='h6'>{t(`common.strings.${role}`)}</Typography>
      </Grid>

      <Grid item container xs={12} spacing={1} className='PersonNrContainer'>
        <TextInput
          name={`${role}.personNr`}
          label={t('routes.persons.person_nr')}
          control={control}
          errors={errors}
          disabled={existingPersonRole === role}
          sx={{ maxWidth: '75%', paddingBottom: existingPersonRole === role ? '45px' : 0 }}
          gridStyle={{ flexDirection: 'row' }}
          validation={{ minLength: 11, maxLength: 11 }}
        />

        {existingPersonRole !== role && (
          <Grid item xs={12}>
            <Button variant='outlined' startIcon={<SubdirectoryArrowRightIcon />} onClick={() => getInfoFromFreg(role)}>
              {t('routes.persons.get_from_freg')}
            </Button>
          </Grid>
        )}
      </Grid>

      <TextInput
        name={`${role}.fullName`}
        label={t('routes.persons.full_name')}
        control={control}
        errors={errors}
        required
        disabled={existingPersonRole === role}
        gridStyle={{ flexDirection: 'row' }}
        validation={{
          // This regex matches strings with minimum 2 names, separated by whitespaces.
          // A name is a string of any length containing only letters A-Å or dash '-'.
          // Surrounding whitecases are also allowed to avoid confusion - these are trimmed later anyway.
          pattern: { value: /^[-\s]*[A-Åa-å]+(?:[-\s][A-Åa-å]+)+[-\s]*$/i, message: t('errors.full_name') },
        }}
      />

      <DateInput
        name={`${role}.birthDate`}
        label={t('routes.persons.birth_date')}
        control={control}
        errors={errors}
        helperText={t('routes.persons.birth_date_helper')}
        disabled={existingPersonRole === role}
        gridStyle={{ flexDirection: 'column' }}
        openTo='year'
      />

      <SelectInput
        name={`${role}.gender`}
        label={t('routes.persons.gender')}
        options={GENDERS}
        control={control}
        errors={errors}
        disabled={existingPersonRole === role}
        renderValue={(value) => capitalize(t('common.strings.gender', { gender: value }))}
      />

      <TextInput
        name={`${role}.streetAddress`}
        label={t('routes.persons.street_address')}
        control={control}
        errors={errors}
        disabled={existingPersonRole === role}
        gridStyle={{ flexDirection: 'row' }}
      />

      <TextInput
        name={`${role}.postArea`}
        label={t('routes.persons.post_area')}
        control={control}
        errors={errors}
        disabled={existingPersonRole === role}
        gridStyle={{ flexDirection: 'row' }}
      />

      {showConflictingPersonInfoError && existingPersonRole !== role && conflictingUserInfoError}
    </Grid>
  );
};

PersonFormHalf.propTypes = {
  role: PropTypes.string.isRequired,
  existingPersonRole: PropTypes.string.isRequired,
  getInfoFromFreg: PropTypes.func.isRequired,
  showConflictingPersonInfoError: PropTypes.bool,
  conflictingUserInfoError: PropTypes.object,
  className: PropTypes.string,
  control: PropTypes.any.isRequired,
  errors: PropTypes.any,
};

PersonFormHalf.defaultProps = {
  className: '',
  showConflictingPersonInfoError: false,
};

export default CaseFormModal;
