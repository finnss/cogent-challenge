import React, { useEffect } from 'react';
import { Button, Chip, Divider, Grid, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useOutletContext } from 'react-router-dom';
import ContentBox from '/components/common/ContentBox';
import TextInput from '/components/forms/inputs/TextInput';
import ToggleButtonGroupInput from '/components/forms/inputs/ToggleButtonGroupInput';
import { getAssessmentLevelButtonOptions } from '/util';
import PastSubjectiveAssessments from '/components/risk_assessments/PastSubjectiveAssessments';

const Step_6_SubjectiveAssessment = () => {
  const { t } = useTranslation();

  const {
    riskAssessment,
    step,
    stepNr,
    form,
    control,
    errors,
    onTempSave,
    onChangeToStep,
    isLoading,
    isReadOnly,
    isExternal,
  } = useOutletContext();

  const watchSevereViolenceRisk = form?.watch('severeViolenceRisk');

  useEffect(() => {
    if (watchSevereViolenceRisk !== null && watchSevereViolenceRisk !== undefined) {
      form?.clearErrors('severeViolenceRisk');
    }
  }, [watchSevereViolenceRisk]);

  return (
    <Grid container spacing={3} className='StepContent'>
      <Grid item xs={12}>
        <Typography variant='h5' fontWeight={500}>
          {t('routes.assessments.steps.6.step_name')}
        </Typography>
        <Divider />
      </Grid>

      {/** Full Assessment */}
      <Grid item xs={12}>
        <ContentBox>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant='h6' marginBottom={2}>
                {t('routes.assessments.steps.6.step_explanation')}
              </Typography>
              <Typography variant='body2'>{`${t('routes.assessments.steps.6.full_assessment')}${
                isExternal ? '' : ' *'
              }`}</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextInput
                name='subjectiveAssessmentDescription'
                label={t('common.strings.full_assessment')}
                control={control}
                errors={errors}
                fullWidth
                multiline
                minRows={18}
                disabled={isReadOnly}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant='h6'>{t('routes.assessments.steps.6.partner_risk')}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant='body2' fontWeight={500}>
                {t('routes.assessments.steps.6.near_future_long')}
                {`${isExternal ? '' : ' *'}`}
              </Typography>
            </Grid>

            <Grid item xs={10} className='RiskAssessmentButtonGroup'>
              <ToggleButtonGroupInput
                form={form}
                name='nearFutureRisk'
                options={getAssessmentLevelButtonOptions(t)}
                control={control}
                errors={errors}
                exclusive
                includeHelperText={false}
                marginBottom={2}
                disabled={isReadOnly}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant='body2' fontWeight={500}>
                {t('common.strings.severe_violence')}
                {`${isExternal ? '' : ' *'}`}
              </Typography>
            </Grid>
            <Grid item xs={10} className='RiskAssessmentButtonGroup'>
              <ToggleButtonGroupInput
                form={form}
                name='severeViolenceRisk'
                options={getAssessmentLevelButtonOptions(t)}
                control={control}
                errors={errors}
                exclusive
                includeHelperText={false}
                marginBottom={2}
                disabled={isReadOnly}
              />
              {watchSevereViolenceRisk === 'high' && !isReadOnly && (
                <Grid item xs={12} paddingLeft={10}>
                  <Chip
                    className='WarningChip'
                    size='medium'
                    label={t('routes.assessments.steps.6.remember_meeting')}
                  />
                </Grid>
              )}
            </Grid>

            {step?.pastRiskAssessments?.length > 0 && (
              <PastSubjectiveAssessments pastRiskAssessments={step.pastRiskAssessments} />
            )}
          </Grid>
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

export default React.memo(Step_6_SubjectiveAssessment);
