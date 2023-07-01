import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { Button, Divider, Grid, IconButton, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';
import '/style/riskassessments.scss';

import { capitalize, formatAdminBids } from '/util/formatters';
import { CIVIL_STATUSES, GENDERS, getPersonCard } from '/util';
import InfoCard from '/components/common/InfoCard';
import { deleteRiskAssessment, getRiskAssessment } from '/modules/riskAssessments';
import WarningBox from '/components/common/WarningBox';
import ContentBox from '/components/common/ContentBox';
import CheckBoxInput from '/components/forms/inputs/CheckBoxInput';
import TextInput from '/components/forms/inputs/TextInput';
import RadioButtonGroupInput from '/components/forms/inputs/RadioButtonGroupInput';
import DateInput from '/components/forms/inputs/DateInput';
import SelectInput from '/components/forms/inputs/SelectInput';
import { fregLookup } from '/modules/search';
import PersonFormModal from '/components/forms/PersonFormModal';
import Modal from '/components/common/Modal';

const Step_1_Information = () => {
  const { t } = useTranslation();
  const { riskAssessmentId } = useParams();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showEditAggressorModal, setShowEditAggressorModal] = useState(false);
  const [showEditVictimModal, setShowEditVictimModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const { riskAssessment, step, stepNr, control, errors, onTempSave, onChangeToStep, isReadOnly, isExternal, form } =
    useOutletContext();

  // Make sure we fill in values for the "disabled" fields in the top of step 1
  const watchAssessmentPerformedBy = form?.watch('assessmentPerformedBy');
  const watchAssessmentStartedAt = form?.watch('assessmentStartedAt');

  useEffect(() => {
    if (!isExternal && form && (!watchAssessmentPerformedBy || !watchAssessmentStartedAt)) {
      if (currentUser?.bid)
        form.setValue(
          'assessmentPerformedBy',
          formatAdminBids(
            riskAssessment.adminBids?.includes(currentUser?.bid)
              ? riskAssessment.adminBids
              : `${riskAssessment.adminBids ? `${riskAssessment.adminBids},` : ''}${currentUser?.bid}`
          )
        );
      if (riskAssessment?.createdAt) form.setValue('assessmentStartedAt', riskAssessment.createdAt);
      if (riskAssessment?.completedAt) form.setValue('assessmentSubmittedAt', riskAssessment.completedAt);
    }
  }, [currentUser, riskAssessment, form, watchAssessmentPerformedBy, watchAssessmentStartedAt, isExternal]);

  // Show a warning if there are more than 10 days between policeReportDate and riskAssessment.createdAt
  // but the moreThanTenDaysOld is not set to true.
  const watchPoliceReportDate = form?.watch('policeReportDate');

  // The error in datepicker fields doesn't get cleared automatically when you choose a date.
  // FIXME If we have a lot of datepicker fields we should find a better and more general way to do this.
  useEffect(() => {
    if (errors?.policeReportDate?.type === 'required' && watchPoliceReportDate !== null) {
      form.clearErrors('policeReportDate');
    }
  }, [watchPoliceReportDate, errors]);

  // Generate info and declae functions for the Aggressor and Victim portions (separated info "PersonHalf" components)
  const aggressorInfoForCard = useMemo(
    () => getPersonCard(t, riskAssessment?.case?.aggressor, true, false),
    [t, riskAssessment?.case]
  );

  const victimInfoForCard = useMemo(
    () => getPersonCard(t, riskAssessment?.case?.victim, true, false),
    [t, riskAssessment?.case]
  );

  const onClickEditPerson = async (role) => {
    await onTempSave();
    if (role === 'aggressor') setShowEditAggressorModal(true);
    else if (role === 'victim') setShowEditVictimModal(true);
  };

  const onUpdateAggressorSuccess = async () => {
    await dispatch(getRiskAssessment(riskAssessment?.id));
    setShowEditAggressorModal(false);
  };

  const onUpdateVictimSuccess = async () => {
    await dispatch(getRiskAssessment(riskAssessment?.id));
    setShowEditVictimModal(false);
  };

  const getInfoFromFreg = async (role) => {
    const personNr = riskAssessment?.case[role].personNr;
    if (!personNr || personNr.length !== 11) {
      return 'required_for_freg';
    }

    const fregResults = await dispatch(fregLookup(personNr));
    if (fregResults && form) {
      form.setValue(role, { ...riskAssessment?.case[role], ...form.getValues(role), ...fregResults });
      form.clearErrors();
      return null;
    }
    return 'generic_freg';
  };

  const onRemoveAltAddress = async (role) => {
    form?.setValue(`${role}.altStreetAddress`, '');
    form?.setValue(`${role}.altPostArea`, '');
    form?.setValue(`${role}.altAddressDescription`, '');
    await onTempSave();
  };

  const watchUsedSourceOther = form?.watch('usedSourceOther');

  return (
    <Grid container spacing={3} className='StepContent'>
      {!isReadOnly && (
        <Grid item xs={12}>
          <Button variant='outlined' style={{ marginBottom: '10px' }} onClick={() => setShowConfirmDelete(true)}>
            {t('routes.assessments.steps.1.cancel_button')}
          </Button>
        </Grid>
      )}

      <Grid item xs={12}>
        <Typography variant='h3' className='StepHeader'>
          {t('routes.assessments.steps.1.intro_header')}{' '}
          {isExternal ? t('routes.assessments.steps.1.header_external') : ''}
        </Typography>
      </Grid>

      {!isReadOnly ? (
        <>
          <Grid item xs={12}>
            <Typography variant='body2'>
              {t('routes.assessments.steps.1.intro_name')}
              <br />
              {t('routes.assessments.steps.1.intro_desc_1')}
              <br />
              {t('routes.assessments.steps.1.intro_desc_2')}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography className='WeakText' variant='body2'>
              {t('routes.assessments.steps.1.intro_saving')}
            </Typography>
          </Grid>

          {step?.usedDistributionCodes?.length > 0 && (
            <Grid item xs={12}>
              <WarningBox>
                <Typography variant='body2'>
                  <b>{t('common.strings.note')}:</b> {t('routes.assessments.steps.1.warning_1')}
                </Typography>
                <ul>
                  {step?.usedDistributionCodes.map((distributionCode) => (
                    <li key={distributionCode}>
                      <Typography variant='body2'>
                        <b>H-{distributionCode[1]}</b> {t(`routes.assessments.steps.9.${distributionCode}`)}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </WarningBox>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant='h4'>{t('routes.assessments.steps.1.step_name')}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <ContentBox>
              <Grid container spacing={3} className='StepInputsContainer'>
                <Grid item xs={12}>
                  <TextInput
                    name='assessmentPerformedBy'
                    label={t('routes.assessments.steps.1.assessment_performed_by')}
                    control={control}
                    errors={errors}
                    disabled={!isExternal}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DateInput
                    name='assessmentStartedAt'
                    label={t('routes.assessments.steps.1.assessment_started_at')}
                    helperText={t('routes.assessments.steps.1.external_date_helper')}
                    control={control}
                    errors={errors}
                    disabled={!isExternal}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DateInput
                    name='assessmentSubmittedAt'
                    label={t('routes.assessments.steps.1.assessment_submitted_at')}
                    helperText={t('routes.assessments.steps.1.external_date_helper')}
                    control={control}
                    errors={errors}
                    disabled={!isExternal}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextInput
                    name='policeReportNumber'
                    label={t('routes.assessments.steps.1.police_report_number')}
                    control={control}
                    errors={errors}
                    disabled={isReadOnly}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DateInput
                    name='policeReportDate'
                    label={t('routes.assessments.steps.1.police_report_date')}
                    helperText={t('routes.persons.birth_date_helper')}
                    control={control}
                    errors={errors}
                    disabled={isReadOnly}
                    openTo='day'
                  />
                </Grid>
                <Grid item xs={12}>
                  <RadioButtonGroupInput
                    name='pastAssessment'
                    label={t('routes.assessments.steps.1.past_assessment')}
                    options={[
                      { name: 'yes', label: t('common.actions.yes'), value: true },
                      { name: 'no', label: t('common.actions.no'), value: false },
                    ]}
                    control={control}
                    errors={errors}
                    disabled={isReadOnly}
                    required={!isExternal}
                  />
                </Grid>
                <Grid item xs={12}>
                  <RadioButtonGroupInput
                    name='repeatedViolence'
                    label={t('routes.assessments.steps.1.repeated_violence')}
                    options={[
                      { name: 'yes', label: t('common.actions.yes'), value: true },
                      { name: 'no', label: t('common.actions.no'), value: false },
                    ]}
                    control={control}
                    errors={errors}
                    disabled={isReadOnly}
                    required={!isExternal}
                  />
                </Grid>
                <Grid item xs={8} style={{ marginTop: '8px' }}>
                  <TextInput
                    name='indiciaDocumentId'
                    label={t('routes.assessments.steps.1.indicia_document_id')}
                    control={control}
                    errors={errors}
                    disabled={isReadOnly}
                  />
                </Grid>
              </Grid>
            </ContentBox>
          </Grid>
        </>
      ) : (
        <Grid item xs={12}>
          <Divider />
        </Grid>
      )}

      <PersonHalf
        role='aggressor'
        form={form}
        infoForCard={aggressorInfoForCard}
        onClickEditPerson={onClickEditPerson}
        getInfoFromFreg={getInfoFromFreg}
        onRemoveAltAddress={onRemoveAltAddress}
        control={control}
        errors={errors}
        isReadOnly={isReadOnly}
        isExternal={isExternal}
      />
      <PersonHalf
        role='victim'
        form={form}
        infoForCard={victimInfoForCard}
        onClickEditPerson={onClickEditPerson}
        getInfoFromFreg={getInfoFromFreg}
        onRemoveAltAddress={onRemoveAltAddress}
        control={control}
        errors={errors}
        isReadOnly={isReadOnly}
        isExternal={isExternal}
      />

      <Grid item xs={12}>
        <ContentBox>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h6'>{t('routes.assessments.steps.1.relationship')}</Typography>
            </Grid>

            <Grid item xs={12}>
              <TextInput
                name='relationshipDesc'
                label={t('routes.assessments.steps.1.relationship_desc')}
                helperText={t('routes.assessments.steps.1.relationship_help')}
                control={control}
                errors={errors}
                disabled={isReadOnly}
                required={!isExternal}
                fullWidth
                multiline
                rows={5}
              />
            </Grid>

            <Grid item xs={12}>
              <RadioButtonGroupInput
                name='areChildrenInvolved'
                label={t('routes.assessments.steps.1.are_children_involved')}
                options={[
                  { name: 'yes', label: t('common.actions.yes'), value: true },
                  { name: 'no', label: t('common.actions.no'), value: false },
                ]}
                control={control}
                errors={errors}
                disabled={isReadOnly}
                required={!isExternal}
              />
            </Grid>
          </Grid>
        </ContentBox>
      </Grid>

      <Grid item xs={12}>
        <ContentBox>
          <Typography variant='h6' className='AssessmentSubHeader'>
            {t('routes.assessments.steps.1.information_sources')}
          </Typography>

          <Typography variant='body1' style={{ marginBottom: '8px' }}>
            {t('routes.assessments.steps.1.information_sources_desc')}
          </Typography>

          <CheckBoxInput
            name='usedSourceAgent'
            label={t('routes.assessments.steps.1.used_source_agent')}
            control={control}
            errors={errors}
            disabled={isReadOnly}
          />
          <CheckBoxInput
            name='usedSourceBL'
            label={t('routes.assessments.steps.1.used_source_BL')}
            control={control}
            errors={errors}
            disabled={isReadOnly}
          />
          <CheckBoxInput
            name='usedSourcePO'
            label={t('routes.assessments.steps.1.used_source_PO')}
            control={control}
            errors={errors}
            disabled={isReadOnly}
          />
          <CheckBoxInput
            name='usedSourceIndicia'
            label={t('routes.assessments.steps.1.used_source_indicia')}
            control={control}
            errors={errors}
            disabled={isReadOnly}
          />
          <CheckBoxInput
            name='usedSourceCase'
            label={t('routes.assessments.steps.1.used_source_case')}
            control={control}
            errors={errors}
            disabled={isReadOnly}
          />
          <CheckBoxInput
            name='usedSourceDUF'
            label={t('routes.assessments.steps.1.used_source_DUF')}
            control={control}
            errors={errors}
            disabled={isReadOnly}
          />
          <CheckBoxInput
            name='usedSourceFREG'
            label={t('routes.assessments.steps.1.used_source_FREG')}
            control={control}
            errors={errors}
            disabled={isReadOnly}
          />
          <CheckBoxInput
            name='usedSourceAggressor'
            label={t('routes.assessments.steps.1.used_source_aggressor')}
            control={control}
            errors={errors}
            disabled={isReadOnly}
          />
          <CheckBoxInput
            name='usedSourceVictim'
            label={t('routes.assessments.steps.1.used_source_victim')}
            control={control}
            errors={errors}
            disabled={isReadOnly}
          />
          <CheckBoxInput
            name='usedSourcePolice'
            label={t('routes.assessments.steps.1.used_source_police')}
            control={control}
            errors={errors}
            disabled={isReadOnly}
          />
          <CheckBoxInput
            name='usedSourceOther'
            label={t('routes.assessments.steps.1.used_source_other')}
            control={control}
            errors={errors}
            disabled={isReadOnly}
          />
          {watchUsedSourceOther && (
            <Grid item xs={12} style={{ marginTop: '8px' }}>
              <TextInput
                name='usedSourceOtherDesc'
                label={t('routes.assessments.steps.1.used_source_other_desc')}
                helperText={t('routes.assessments.steps.1.used_source_other_desc_helper')}
                control={control}
                errors={errors}
                disabled={isReadOnly}
                required={false}
              />
            </Grid>
          )}
        </ContentBox>
      </Grid>

      <Grid item xs={12} className='StepButtonsContainer'>
        {isReadOnly ? (
          <Button
            variant='outlined'
            onClick={() => onChangeToStep(9)}
            className='PrevButton'
            startIcon={<ArrowBackIcon />}>
            {t('common.actions.previous')}
          </Button>
        ) : (
          <span />
        )}
        <Button
          variant='contained'
          onClick={() => onChangeToStep(stepNr + 1)}
          className='NextButton'
          endIcon={<ArrowForwardIcon />}>
          {t('common.actions.next')}
        </Button>
      </Grid>

      <PersonFormModal
        defaultValues={riskAssessment?.case?.aggressor}
        open={showEditAggressorModal}
        onClose={() => setShowEditAggressorModal(false)}
        className='UpdatePersonModal'
        onSuccess={onUpdateAggressorSuccess}
      />
      <PersonFormModal
        defaultValues={riskAssessment?.case?.victim}
        open={showEditVictimModal}
        onClose={() => setShowEditVictimModal(false)}
        className='UpdatePersonModal'
        onSuccess={onUpdateVictimSuccess}
      />

      <Modal
        title={t('routes.assessments.steps.1.cancel_confirmation_title')}
        open={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        actions={[
          {
            label: t('routes.assessments.steps.1.cancel_confirmation_no'),
            action: () => setShowConfirmDelete(false),
            variant: 'text',
          },
          {
            label: t('routes.assessments.steps.1.cancel_confirmation_yes'),
            action: async () => {
              const caseId = riskAssessment.caseId;
              await dispatch(deleteRiskAssessment(riskAssessmentId));
              navigate(`/cases/${caseId}`);
            },
            variant: 'contained',
          },
        ]}
        className='ConfirmModal'>
        <Typography variant='body2'>{t('routes.assessments.steps.1.cancel_confirmation')}</Typography>
      </Modal>
    </Grid>
  );
};

// The initial part of Step 1 is separated out into a separate component because it is moved to the
// initial Summary in Read Only mode.
export const InitialInformation = ({ daysBetweenPoliceReportAndAssessmentStart, control, errors, isReadOnly }) => {
  const { t } = useTranslation();

  return (
    <ContentBox>
      <Grid container spacing={3} className='StepInputsContainer'>
        <Grid item xs={12}>
          <TextInput
            name='assessmentPerformedBy'
            label={t('routes.assessments.steps.1.assessment_performed_by')}
            control={control}
            errors={errors}
            disabled
          />
        </Grid>
        <Grid item xs={6}>
          <DateInput
            name='assessmentStartedAt'
            label={t('routes.assessments.steps.1.assessment_started_at')}
            control={control}
            errors={errors}
            disabled
          />
        </Grid>
        <Grid item xs={6}>
          <DateInput
            name='assessmentSubmittedAt'
            label={t('routes.assessments.steps.1.assessment_submitted_at')}
            control={control}
            errors={errors}
            disabled
          />
        </Grid>
        <Grid item xs={6}>
          <TextInput
            name='policeReportNumber'
            label={t('routes.assessments.steps.1.police_report_number')}
            control={control}
            errors={errors}
            disabled={isReadOnly}
          />
        </Grid>
        <Grid item xs={6}>
          <DateInput
            name='policeReportDate'
            label={t('routes.assessments.steps.1.police_report_date')}
            helperText={t('routes.persons.birth_date_helper')}
            control={control}
            errors={errors}
            disabled={isReadOnly}
            openTo='day'
          />
        </Grid>
        <Grid item xs={12} className='MoreThanTenDaysOld'>
          <CheckBoxInput
            name='moreThanTenDaysOld'
            label={t('routes.assessments.steps.1.more_than_ten_days_old')}
            control={control}
            errors={errors}
            disabled={isReadOnly}
          />
          {!!(daysBetweenPoliceReportAndAssessmentStart && daysBetweenPoliceReportAndAssessmentStart > 10) && (
            <Typography variant='body1' className='WarningBubble WeakText'>
              {t('routes.assessments.steps.1.more_than_ten_days_old_warning', {
                days: daysBetweenPoliceReportAndAssessmentStart,
              })}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <RadioButtonGroupInput
            name='pastAssessment'
            label={t('routes.assessments.steps.1.past_assessment')}
            options={[
              { name: 'yes', label: t('common.actions.yes'), value: true },
              { name: 'no', label: t('common.actions.no'), value: false },
            ]}
            control={control}
            errors={errors}
            disabled={isReadOnly}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <RadioButtonGroupInput
            name='repeatedViolence'
            label={t('routes.assessments.steps.1.repeated_violence')}
            options={[
              { name: 'yes', label: t('common.actions.yes'), value: true },
              { name: 'no', label: t('common.actions.no'), value: false },
            ]}
            control={control}
            errors={errors}
            disabled={isReadOnly}
            required
          />
        </Grid>
        <Grid item xs={8} style={{ marginTop: '8px' }}>
          <TextInput
            name='indiciaDocumentId'
            label={t('routes.assessments.steps.1.indicia_document_id')}
            control={control}
            errors={errors}
            disabled={isReadOnly}
          />
        </Grid>
      </Grid>
    </ContentBox>
  );
};

InitialInformation.propTypes = {
  daysBetweenPoliceReportAndAssessmentStart: PropTypes.number,
  control: PropTypes.any.isRequired,
  errors: PropTypes.any,
  isReadOnly: PropTypes.bool,
};

const PersonHalf = ({
  role,
  form,
  infoForCard,
  onClickEditPerson,
  getInfoFromFreg,
  onRemoveAltAddress,
  control,
  errors,
  isReadOnly,
  isExternal,
}) => {
  const { t } = useTranslation();
  const [showAlternateAddress, setShowAlternateAddress] = useState(false);
  const [fregButtonError, setFregButtonError] = useState();

  // Display the collapsible "Alternate address" for aggressor / victim if it is already filled out.
  const watchAltAddress = form?.watch(`${role}.altStreetAddress`);
  const watchAltPostArea = form?.watch(`${role}.altPostArea`);
  const watchAltAddressDescription = form?.watch(`${role}.altAddressDescription`);
  useEffect(() => {
    if (
      !showAlternateAddress &&
      (watchAltAddress?.length > 0 || watchAltPostArea?.length > 0 || watchAltAddressDescription?.length > 0)
    ) {
      setShowAlternateAddress(true);
    }
  }, [showAlternateAddress, watchAltAddress, watchAltPostArea, watchAltAddressDescription]);

  const onClickRemoveAltAddress = async () => {
    await onRemoveAltAddress(role);
    setShowAlternateAddress(false);
  };

  // Watch form values and detect them in useEffects to not allow unknown phone/email flag = true in combination
  // with filled-in values for phone / email.
  const watchPhoneNr = form?.watch(`${role}.phoneNr`);
  const watchEmail = form?.watch(`${role}.email`);
  const watchPhoneNrUnknown = form?.watch(`${role}.phoneNrUnknown`);
  const watchEmailUnknown = form?.watch(`${role}.emailUnknown`);
  useEffect(() => {
    if (watchPhoneNr?.length > 0 && !!watchPhoneNrUnknown) {
      form?.setValue(`${role}.phoneNrUnknown`, false);
    }
  }, [watchPhoneNr, watchPhoneNrUnknown]);
  useEffect(() => {
    if (watchEmail?.length > 0 && !!watchEmailUnknown) {
      form?.setValue(`${role}.emailUnknown`, false);
    }
  }, [watchEmail, watchEmailUnknown]);

  // Replace the text for "get freg info" with "update freg info" if any of the relevant
  // fields are not empty
  const watchCitizenship = form?.watch(`${role}.citizenship`);
  const watchResidencePermit = form?.watch(`${role}.residencePermit`);
  const watchBirthCountry = form?.watch(`${role}.birthCountry`);
  const watchBirthPlace = form?.watch(`${role}.birthPlace`);

  const alreadyGotFregInfo = useMemo(
    () =>
      watchCitizenship?.length > 0 ||
      watchResidencePermit?.length > 0 ||
      watchBirthCountry?.length > 0 ||
      watchBirthPlace?.length > 0,
    [watchCitizenship, watchResidencePermit, watchBirthCountry, watchBirthPlace]
  );

  // Set a custom, non-form error under the "Get info from freg button" if
  // the "getInfoFromFreg" function returns an error. The error might be because personNr
  // was missing, so clear the error if we find a new personNr.
  const watchPersonNr = form?.watch(`${role}.personNr`);
  useEffect(() => {
    if (fregButtonError && watchPersonNr?.length > 0) {
      setFregButtonError(undefined);
    }
  }, [watchPersonNr]);

  // In external mode, we use a hack to work around a person's fullName requirements.
  const watchFullName = form?.watch(`${role}.fullName`);
  useEffect(() => {
    if (isExternal && form && watchFullName && watchFullName === 'old') {
      form?.setValue(`${role}.fullName`, '');
    }
  }, [watchFullName, isExternal, form]);

  const onFregClicked = async () => {
    const fregErrorMessage = await getInfoFromFreg(role);
    if (fregErrorMessage) {
      setFregButtonError(t(`errors.${fregErrorMessage}`, { role: t(`common.strings.${role}`) }));
    } else {
      setFregButtonError(undefined);
    }
  };

  return (
    <Grid item xs={12}>
      <ContentBox>
        <Grid container spacing={2} className='StepInputsContainer'>
          <Grid item xs={12}>
            <Typography variant='h6'>{t(`common.strings.${role}`)}</Typography>
          </Grid>

          {!isExternal ? (
            <Grid item xs={12} style={{ display: 'flex', alignItems: 'baseline' }}>
              <InfoCard data={infoForCard} style={{ display: 'inlineBlock' }} />
              {!isReadOnly && (
                <IconButton onClick={() => onClickEditPerson(role)} className='Step1EditPerson'>
                  <EditIcon fontSize='small' />
                </IconButton>
              )}
            </Grid>
          ) : (
            <Grid item xs={10} container spacing={3}>
              <TextInput
                name={`${role}.fullName`}
                label={t('routes.persons.full_name')}
                control={control}
                errors={errors}
                gridStyle={{ flexDirection: 'row' }}
                validation={{
                  // This regex matches strings with minimum 2 names, separated by whitespaces.
                  // A name is a string of any length containing only letters A-Å or dash '-'.
                  // Surrounding whitecases are also allowed to avoid confusion - these are trimmed later anyway.
                  pattern: { value: /^[-\s]*[A-Åa-å]+(?:[-\s][A-Åa-å]+)+[-\s]*$/i, message: t('errors.full_name') },
                }}
              />

              <TextInput
                name={`${role}.personNr`}
                label={t('routes.persons.person_nr')}
                control={control}
                errors={errors}
                gridStyle={{ flexDirection: 'row' }}
                validation={{ minLength: 11, maxLength: 11 }}
              />

              <DateInput
                name={`${role}.birthDate`}
                label={t('routes.persons.birth_date')}
                control={control}
                errors={errors}
                helperText={t('routes.persons.birth_date_helper')}
                openTo='year'
              />

              <SelectInput
                name={`${role}.gender`}
                label={t('routes.persons.gender')}
                options={GENDERS}
                control={control}
                errors={errors}
                gridStyle={{ flexDirection: 'row' }}
                renderValue={(value) => capitalize(t('common.strings.gender', { gender: value }))}
              />

              <TextInput
                name={`${role}.streetAddress`}
                label={t('routes.persons.street_address')}
                control={control}
                errors={errors}
                gridStyle={{ flexDirection: 'row' }}
              />

              <TextInput
                name={`${role}.postArea`}
                label={t('routes.persons.post_area')}
                control={control}
                errors={errors}
                gridStyle={{ flexDirection: 'row' }}
              />
            </Grid>
          )}

          {!showAlternateAddress && !isReadOnly && (
            <Grid item xs={12}>
              <Button
                variant='text'
                className='StandaloneLink AddAlternateAddress'
                onClick={() => setShowAlternateAddress(true)}>
                <AddIcon /> {t('routes.assessments.steps.1.add_alternate_address')}
              </Button>
            </Grid>
          )}

          {showAlternateAddress && (
            <Grid item xs={12} container spacing={2} className='AlternateAddress'>
              <Grid item xs={12} style={{ justifyContent: 'space-between', display: 'flex' }}>
                <Typography variant='body2'>{t('routes.assessments.steps.1.alt_address_title')}</Typography>
                {!isReadOnly && (
                  <Button variant='text' onClick={onClickRemoveAltAddress}>
                    {t('common.actions.remove')}
                  </Button>
                )}
              </Grid>

              <Grid item xs={8}>
                <TextInput
                  name={`${role}.altStreetAddress`}
                  label={t('routes.persons.street_address')}
                  control={control}
                  errors={errors}
                  disabled={isReadOnly}
                />
              </Grid>
              <Grid item xs={6}>
                <TextInput
                  name={`${role}.altPostArea`}
                  label={t('routes.persons.post_area')}
                  control={control}
                  errors={errors}
                  disabled={isReadOnly}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  name={`${role}.altAddressDescription`}
                  label={t('routes.assessments.steps.1.alt_address_description')}
                  helperText={t('routes.assessments.steps.1.alt_address_description_helper')}
                  control={control}
                  errors={errors}
                  disabled={isReadOnly}
                />
              </Grid>
            </Grid>
          )}

          <Grid item xs={6} marginTop={isReadOnly && 1}>
            <TextInput
              name={`${role}.phoneNr`}
              label={t('routes.assessments.steps.1.phone_nr')}
              control={control}
              errors={errors}
              disabled={isReadOnly}
            />
          </Grid>
          <Grid item xs={12} className='AttachedCheckbox'>
            <CheckBoxInput
              name={`${role}.phoneNrUnknown`}
              label={t('routes.assessments.steps.1.phone_nr_unknown')}
              control={control}
              errors={errors}
              disabled={isReadOnly || watchPhoneNr?.length > 0}
            />
          </Grid>
          <Grid item xs={8}>
            <TextInput
              name={`${role}.email`}
              label={t('routes.assessments.steps.1.email')}
              control={control}
              errors={errors}
              disabled={isReadOnly}
            />
          </Grid>
          <Grid item xs={12} className='AttachedCheckbox'>
            <CheckBoxInput
              name={`${role}.emailUnknown`}
              label={t('routes.assessments.steps.1.email_unknown')}
              control={control}
              errors={errors}
              disabled={isReadOnly || watchEmail?.length > 0}
            />
          </Grid>
          {!isReadOnly && !isExternal && (
            <Grid item xs={12}>
              <Button
                variant='outlined'
                startIcon={<PersonSearchIcon />}
                onClick={onFregClicked}
                disabled={!watchPersonNr || watchPersonNr.length === 0}>
                {alreadyGotFregInfo
                  ? t('routes.assessments.steps.1.update_from_freg')
                  : t('routes.persons.get_from_freg')}
              </Button>
              {fregButtonError && fregButtonError.length > 0 && (
                <Typography role='alert' className='ErrorMessage'>
                  {fregButtonError}
                </Typography>
              )}
            </Grid>
          )}
          <Grid item xs={6} style={{ marginBottom: '30px' }}>
            <SelectInput
              name={`${role}.civilStatus`}
              label={t('routes.assessments.steps.1.civil_status')}
              options={CIVIL_STATUSES}
              control={control}
              errors={errors}
              disabled={isReadOnly}
              renderValue={(value) => capitalize(t(`common.strings.civil_statuses.${value}`))}
            />
          </Grid>

          <Grid item xs={8}>
            <TextInput
              name={`${role}.citizenship`}
              label={t('routes.assessments.steps.1.citizenship')}
              control={control}
              errors={errors}
              disabled={isReadOnly}
            />
          </Grid>
          <Grid item xs={6}>
            <TextInput
              name={`${role}.residencePermit`}
              label={t('routes.assessments.steps.1.residence_permit')}
              control={control}
              errors={errors}
              disabled={isReadOnly}
            />
          </Grid>
          <Grid item xs={8}>
            <TextInput
              name={`${role}.birthCountry`}
              label={t('routes.assessments.steps.1.birth_country')}
              control={control}
              errors={errors}
              disabled={isReadOnly}
            />
          </Grid>
          <Grid item xs={8}>
            <TextInput
              name={`${role}.birthPlace`}
              label={t('routes.assessments.steps.1.birth_place')}
              control={control}
              errors={errors}
              disabled={isReadOnly}
            />
          </Grid>
        </Grid>
      </ContentBox>
    </Grid>
  );
};

PersonHalf.propTypes = {
  role: PropTypes.string.isRequired,
  form: PropTypes.any.isRequired,
  infoForCard: PropTypes.object.isRequired,
  onClickEditPerson: PropTypes.func.isRequired,
  getInfoFromFreg: PropTypes.func.isRequired,
  onRemoveAltAddress: PropTypes.func.isRequired,
  control: PropTypes.any.isRequired,
  errors: PropTypes.any,
  isReadOnly: PropTypes.bool,
  isExternal: PropTypes.bool,
};

export default React.memo(Step_1_Information);
