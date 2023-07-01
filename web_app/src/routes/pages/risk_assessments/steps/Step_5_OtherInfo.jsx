import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import { Button, Divider, Grid, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '/style/riskassessments.scss';
import RadioButtonGroupInput from '/components/forms/inputs/RadioButtonGroupInput';
import CheckBoxInput from '/components/forms/inputs/CheckBoxInput';
import InfoIconTooltip from '/components/common/InfoIconTooltip';
import TextInput from '/components/forms/inputs/TextInput';
import DateInput from '/components/forms/inputs/DateInput';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import DynamicSituations from '/components/risk_assessments/DynamicSituations';
import ContentBox from '/components/common/ContentBox';
import { getButtonOptions } from '/util';
import { fregLookup } from '/modules/search';
import { useDispatch } from 'react-redux';
import PastSituations from '/components/risk_assessments/PastSituations';

const Step_5_OtherInfo = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [fregButtonError, setFregButtonError] = useState();
  const { riskAssessment, step, stepNr, form, control, errors, onChangeToStep, isReadOnly, isExternal } =
    useOutletContext();

  const watchReportedConcern = form?.watch('concernReported');
  const watchWeaponRegistryChecked = form?.watch('weaponRegistryChecked');

  const onFregClicked = async () => {
    const aggressor = riskAssessment.case['aggressor'];
    const victim = riskAssessment.case['victim'];
    const fregErrorMessage = await getInfoFromFreg(aggressor, victim);
    if (fregErrorMessage) {
      setFregButtonError(
        t(`errors.${fregErrorMessage}`, {
          victim: t(`common.strings.victim`),
          aggressor: t('common.strings.aggressor'),
        })
      );
    } else {
      setFregButtonError(undefined);
    }
  };

  const getInfoFromFreg = async (aggressor, victim) => {
    const aggressorPersonNr = aggressor?.personNr;
    const victimPersonNr = victim?.personNr;

    if (!aggressorPersonNr || aggressorPersonNr.length !== 11 || !victimPersonNr || victimPersonNr.length !== 11) {
      return 'required_for_freg';
    }

    const fregResultsAggressor = await dispatch(fregLookup(aggressorPersonNr));
    const fregResultsVictim = await dispatch(fregLookup(victimPersonNr));
    if (fregResultsAggressor && fregResultsVictim && form) {
      /**
       * Results from FREG should auto-fill the 'informationFromSource' field in the first situation
       * in the situation list. This will overwrite anything written in that field previously.
       */
      form.setValue('childrenSituations.0.informationFromSource', 'Ingen barn');
    }

    return 'generic_freg';
  };

  return (
    <Grid container spacing={3} className='StepContent'>
      <Grid item xs={12}>
        <Typography variant='h5' style={{ fontWeight: 500 }}>
          {t('routes.assessments.steps.5.step_name')}
        </Typography>
        <Typography variant='body2' marginBottom={2} className='WeakText'>
          {t('routes.assessments.steps.5.step_explanation')}
        </Typography>
        <Divider />
      </Grid>

      {/** Weapon Information */}
      <Grid item xs={12}>
        <ContentBox>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant='h6' marginBottom={1} style={{ fontWeight: 500 }}>
                {t('routes.assessments.steps.5.weapon_information')}
              </Typography>
              <CheckBoxInput
                name={'weaponRegistryChecked'}
                label={t('routes.assessments.steps.5.weapon_registry_checked')}
                control={control}
                errors={errors}
                disabled={isReadOnly}
                required={!isExternal}
              />
            </Grid>
            <Grid item xs={12} className='NoAsterisk'>
              <Typography variant='body2'>{t('routes.assessments.steps.5.weapon_registered')}</Typography>
              <RadioButtonGroupInput
                name='aggressorHasRegisteredWeapon'
                options={getButtonOptions()}
                control={control}
                errors={errors}
                required
                radioProps={{ row: true }}
                disabled={!watchWeaponRegistryChecked || isReadOnly}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant='body2' marginBottom={2}>
                {t('routes.assessments.steps.5.weapon_type')}
              </Typography>
              <TextInput
                name='weaponType'
                label={t('common.strings.type')}
                control={control}
                errors={errors}
                disabled={!watchWeaponRegistryChecked || isReadOnly}
              />
            </Grid>

            <Grid item xs={12} className='NoAsterisk'>
              <Typography variant='body2'>{t('routes.assessments.steps.5.previously_associated_weapons')}</Typography>
              <Typography variant='body2' className='WeakText'>
                {t('routes.assessments.steps.5.previously_associated_weapons_desc')}
              </Typography>
              <RadioButtonGroupInput
                name='aggressorPreviouslyHandledWeapons'
                options={getButtonOptions(true, t('common.strings.dont_know'))}
                control={control}
                errors={errors}
                required
                radioProps={{ row: true }}
                disabled={isReadOnly}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant='h6' marginBottom={2}>
                {t('routes.persons.information')}
              </Typography>
              <DynamicSituations
                fieldName='weaponSituations'
                step={step}
                stepNr={stepNr}
                control={control}
                errors={errors}
                form={form}
                isReadOnly={isReadOnly}
              />
            </Grid>

            <Grid container spacing={2} className='NoAsterisk' paddingLeft={3}>
              <Grid item xs={12}>
                <Typography variant='body2'>{t('routes.assessments.steps.5.reported_concern')}</Typography>
                <RadioButtonGroupInput
                  name='concernReported'
                  options={getButtonOptions()}
                  control={control}
                  errors={errors}
                  required
                  radioProps={{ row: true }}
                  disabled={isReadOnly}
                />
              </Grid>

              <Grid item xs={4}>
                <DateInput
                  name='concernReportedAt'
                  label={t('routes.assessments.steps.5.reported_concern_date')}
                  control={control}
                  errors={errors}
                  disabled={watchReportedConcern !== 'true' || isReadOnly}
                />
              </Grid>

              <Grid item xs={12}>
                <TextInput
                  name='concernReportDetails'
                  label={t('routes.assessments.steps.5.reported_concern_details')}
                  control={control}
                  errors={errors}
                  fullWidth
                  multiline
                  minRows={8}
                  disabled={watchReportedConcern !== 'true' || isReadOnly}
                />
              </Grid>
            </Grid>

            {step?.pastRiskAssessments?.length > 0 && (
              <PastSituations pastRiskAssessments={step.pastRiskAssessments} stepNr={stepNr} dataKey='weapon' />
            )}
          </Grid>
        </ContentBox>
      </Grid>

      {/** Childrens role */}
      <Grid item xs={12}>
        <ContentBox>
          <Grid container item xs={12}>
            <Typography variant='h6'>{t('routes.assessments.steps.5.childrens_role_title')}</Typography>
            <Typography marginTop={2} variant='body2'>
              {t('routes.assessments.steps.5.childrens_role_desc1')}
            </Typography>
            <Typography marginTop={3} variant='body2'>
              {t('routes.assessments.steps.5.childrens_role_desc2')}
            </Typography>
          </Grid>

          {!isReadOnly && (
            <Grid item xs={12} marginTop={2}>
              <Button variant='outlined' startIcon={<PersonSearchIcon />} onClick={onFregClicked}>
                {t('routes.assessments.steps.5.update_from_freg_children')}
              </Button>
            </Grid>
          )}

          <Grid item xs={12} marginTop={5}>
            <DynamicSituations
              fieldName='childrenSituations'
              step={step}
              stepNr={stepNr}
              control={control}
              errors={errors}
              form={form}
              isReadOnly={isReadOnly}
            />
          </Grid>

          <Grid container spacing={3} style={{ alignItems: 'flex-end' }}>
            <Grid item xs={12}>
              <Typography variant='h6'>{t('routes.assessments.situation')}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant='body2' fontWeight={500}>
                {t('routes.assessments.steps.5.violence_against_children')}
              </Typography>
            </Grid>
            <Grid item xs={4} className='NoAsterisk' style={{ padding: '0px' }}>
              <RadioButtonGroupInput
                name='doParentsHaveChildViolenceHistory'
                options={getButtonOptions(true, null, 'top')}
                control={control}
                errors={errors}
                required
                fontWeight={500}
                radioProps={{ row: true }}
                disabled={isReadOnly}
              />
            </Grid>
            <Grid item xs={12} style={{ paddingTop: '16px' }}>
              <TextInput
                name='doParentsHaveChildViolenceHistoryDesc'
                label={t('routes.risk_factor_evaluation.elaborating_information')}
                control={control}
                errors={errors}
                fullWidth
                disabled={isReadOnly}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} marginTop={4} style={{ alignItems: 'flex-end' }}>
            <Grid item xs={8}>
              <Typography variant='body2' fontWeight={500}>
                {t('routes.assessments.steps.5.child_violence_history')}
              </Typography>
            </Grid>
            <Grid item xs={4} className='NoAsterisk' style={{ padding: '0px' }}>
              <RadioButtonGroupInput
                name='childIsExposedToPartnerViolence'
                options={getButtonOptions(true, null, 'top')}
                control={control}
                errors={errors}
                required
                fontWeight={500}
                radioProps={{ row: true }}
                disabled={isReadOnly}
              />
            </Grid>
            <Grid item xs={12} style={{ paddingTop: '8px' }}>
              <TextInput
                name='childIsExposedToPartnerViolenceDesc'
                label={t('routes.risk_factor_evaluation.elaborating_information')}
                control={control}
                errors={errors}
                fullWidth
                disabled={isReadOnly}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} marginTop={4} style={{ alignItems: 'flex-end' }}>
            <Grid item xs={8}>
              <Typography variant='body2' fontWeight={500}>
                {t('routes.assessments.steps.5.child_threatened')}
              </Typography>
            </Grid>
            <Grid item xs={4} className='NoAsterisk' style={{ padding: '0px' }}>
              <RadioButtonGroupInput
                name='childIsThreatened'
                options={getButtonOptions(true, null, 'top')}
                control={control}
                errors={errors}
                required
                fontWeight={500}
                radioProps={{ row: true }}
                disabled={isReadOnly}
              />
            </Grid>
            <Grid item xs={12} style={{ paddingTop: '8px' }}>
              <TextInput
                name='childIsThreatenedDesc'
                label={t('routes.risk_factor_evaluation.elaborating_information')}
                control={control}
                errors={errors}
                fullWidth
                disabled={isReadOnly}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} marginTop={4} style={{ alignItems: 'flex-end' }}>
            <Grid item xs={8}>
              <Typography variant='body2' fontWeight={500}>
                {t('routes.assessments.steps.5.violence_exposure')}
              </Typography>
            </Grid>
            <Grid item xs={4} className='NoAsterisk' style={{ padding: '0px' }}>
              <RadioButtonGroupInput
                name='didChildExposureIncrease'
                options={getButtonOptions(true, null, 'top')}
                control={control}
                errors={errors}
                required
                fontWeight={500}
                radioProps={{ row: true }}
                disabled={isReadOnly}
              />
            </Grid>
            <Grid item xs={12} style={{ paddingTop: '8px' }}>
              <TextInput
                name='didChildExposureIncreaseDesc'
                label={t('routes.risk_factor_evaluation.elaborating_information')}
                control={control}
                errors={errors}
                fullWidth
                disabled={isReadOnly}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} marginTop={4} style={{ alignItems: 'flex-end' }}>
            <Grid item xs={8}>
              <Typography variant='body2' fontWeight={500}>
                {t('routes.assessments.steps.5.violence_during_pregnancy')}
              </Typography>
            </Grid>
            <Grid item xs={4} className='NoAsterisk' style={{ padding: '0px' }}>
              <RadioButtonGroupInput
                name='violenceDuringPregnancy'
                options={getButtonOptions(true, null, 'top')}
                control={control}
                errors={errors}
                required
                fontWeight={500}
                radioProps={{ row: true }}
                disabled={isReadOnly}
              />
            </Grid>
            <Grid item xs={12} style={{ paddingTop: '8px' }}>
              <TextInput
                name='violenceDuringPregnancyDesc'
                label={t('routes.risk_factor_evaluation.elaborating_information')}
                control={control}
                errors={errors}
                fullWidth
                disabled={isReadOnly}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} marginTop={4} style={{ alignItems: 'flex-end' }}>
            <Grid item xs={8}>
              <Typography variant='body2' fontWeight={500}>
                {t('routes.assessments.steps.5.other_info')}
              </Typography>
            </Grid>
            <Grid item xs={4} className='NoAsterisk' style={{ padding: '0px' }}>
              <RadioButtonGroupInput
                name='otherChildInfo'
                options={getButtonOptions(true, null, 'top')}
                control={control}
                errors={errors}
                required
                fontWeight={500}
                radioProps={{ row: true }}
                disabled={isReadOnly}
              />
            </Grid>
            <Grid item xs={12} style={{ paddingTop: '8px' }}>
              <TextInput
                name='otherChildInfoDesc'
                label={t('routes.risk_factor_evaluation.elaborating_information')}
                control={control}
                errors={errors}
                fullWidth
                disabled={isReadOnly}
              />
            </Grid>
          </Grid>

          {step?.pastRiskAssessments?.length > 0 && (
            <PastSituations pastRiskAssessments={step.pastRiskAssessments} stepNr={stepNr} dataKey='children' />
          )}
        </ContentBox>
      </Grid>

      {/** Other relevant info */}
      <Grid item xs={12}>
        <ContentBox>
          <Grid container item xs={12} marginBottom={3}>
            <Typography variant='h6'>
              {t('routes.assessments.steps.5.other_relevant_assessment_information')}
            </Typography>
            <Typography marginTop={2} variant='body2'>
              {t('routes.assessments.steps.5.other_relevant_assessment_information_desc')}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant='h6' marginBottom={3} style={{ display: 'flex', alignItems: 'center' }}>
              {t('routes.assessments.relevant_situation')}
              <InfoIconTooltip
                text={t('routes.assessments.relevant_situation_description')}
                className='InfoIconTooltip'
              />
            </Typography>
            <DynamicSituations
              fieldName='otherRelevantSituations'
              step={step}
              stepNr={stepNr}
              control={control}
              errors={errors}
              form={form}
              isReadOnly={isReadOnly}
            />
          </Grid>

          {step?.pastRiskAssessments?.length > 0 && (
            <PastSituations pastRiskAssessments={step.pastRiskAssessments} stepNr={stepNr} dataKey='other' />
          )}
        </ContentBox>
      </Grid>

      <Grid item xs={12} className='StepButtonsContainer'>
        <Button
          variant='outlined'
          onClick={() => onChangeToStep(stepNr - 1)}
          className='PrevButton'
          startIcon={<ArrowBackIcon />}>
          {t('common.actions.previous')}
        </Button>
        <Button
          variant='contained'
          onClick={() => onChangeToStep(stepNr + 1)}
          className='NextButton'
          endIcon={<ArrowForwardIcon />}>
          {t('common.actions.next')}
        </Button>
      </Grid>
    </Grid>
  );
};

export default React.memo(Step_5_OtherInfo);
