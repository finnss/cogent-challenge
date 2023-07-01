import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Button, Divider, Grid, StepIcon, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '/style/riskassessments.scss';

import VerifiedIcon from '@mui/icons-material/Verified';
import { CopyAll, PictureAsPdf } from '@mui/icons-material';
import { camelToSnakeCase, getAssessmentLevelButtonOptions, getUsedSources, prepadZeroes } from '/util';
import CheckBoxInput from '/components/forms/inputs/CheckBoxInput';
import dayjs from 'dayjs';
import { validateRiskAssessment, validateStep } from '/modules/riskAssessments';
import { showToast } from '/modules/toast';
import Modal from '/components/common/Modal';
import ReadOnlySummary, { onClickDownloadPDF } from '/components/risk_assessments/ReadOnlySummary';
import clsx from 'clsx';
import { capitalize } from '/util/formatters';

const Step_9_Summary = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showSubmittedModal, setShowSubmittedModal] = useState(false);

  const { riskAssessment, step, stepNr, form, control, errors, onTempSave, onChangeToStep, isReadOnly, isExternal } =
    useOutletContext();

  const onSubmitRiskAssessment = () => {
    setShowConfirmSubmit(true);
  };

  const onConfirmSubmit = async () => {
    await onTempSave();
    await dispatch(validateStep(riskAssessment.id, stepNr));
    const validationResult = await dispatch(validateRiskAssessment(riskAssessment.id, true));
    if (validationResult?.valid) {
      dispatch(showToast(t('routes.assessments.steps.9.submitted')));
      setShowConfirmSubmit(false);
      setShowSubmittedModal(true);
    } else {
      console.warn('validation should have been successful? validationResult:', validationResult);
      dispatch(showToast(t('errors.generic'), -1, 'error'));
    }
  };

  const watchMoreThanTenDaysOld = form?.watch('moreThanTenDaysOld');

  const daysBetweenPoliceReportAndAssessmentStart = useMemo(() => {
    if (!riskAssessment?.createdAt || !step || !step.step1?.policeReportDate || watchMoreThanTenDaysOld)
      return undefined;

    const diffInMs = dayjs(riskAssessment.createdAt).diff(dayjs(step.step1.policeReportDate));
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return Math.abs(Math.floor(diffInDays));
  }, [riskAssessment, watchMoreThanTenDaysOld, step]);

  const numMissingRequiredFields = useMemo(
    () =>
      Object.keys(riskAssessment?.validation?.errors)
        .filter((stepnr) => Number(stepnr) !== 9)
        .reduce((soFar, current) => soFar + Object.keys(riskAssessment?.validation?.errors[current].errors).length, 0),
    [riskAssessment]
  );

  const usedSources = useMemo(() => getUsedSources(step?.step1, t), [step]);

  if (isReadOnly) return <ReadOnlySummary />;

  return (
    <Grid container spacing={4} className='StepContent'>
      <Grid item xs={12}>
        <Typography variant='h3' className='StepHeader'>
          {t('routes.assessments.steps.9.step_name')}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <Typography variant='h6' className='AssessmentSubHeader' marginBottom={1}>
          {t('routes.assessments.steps.9.distribution_codes')}
        </Typography>

        <Typography variant='body2' marginBottom={1}>
          {t('routes.assessments.steps.9.distribution_codes_help')}
        </Typography>

        <CheckBoxInput
          name='usesDistributionCodeH0'
          label={
            <Typography variant='body2' paddingLeft={2}>
              <b>H-0</b> {t('routes.assessments.steps.9.h0')}
            </Typography>
          }
          control={control}
          errors={errors}
        />
        <CheckBoxInput
          name='usesDistributionCodeH1'
          label={
            <Typography variant='body2' paddingLeft={2}>
              <b>H-1</b> {t('routes.assessments.steps.9.h1')}
            </Typography>
          }
          control={control}
          errors={errors}
        />
        <CheckBoxInput
          name='usesDistributionCodeH2'
          label={
            <Typography variant='body2' paddingLeft={2}>
              <b>H-2</b> {t('routes.assessments.steps.9.h2')}
            </Typography>
          }
          control={control}
          errors={errors}
        />
        <CheckBoxInput
          name='usesDistributionCodeH3'
          label={
            <Typography variant='body2' paddingLeft={2}>
              <b>H-3</b> {t('routes.assessments.steps.9.h3')}
            </Typography>
          }
          control={control}
          errors={errors}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant='h6' className='AssessmentSubHeader'>
          {t('routes.assessments.steps.9.missing_required_fields')}
        </Typography>

        {numMissingRequiredFields === 0 ? (
          <Typography variant='body2' style={{ display: 'flex' }}>
            <VerifiedIcon className='VerifiedIcon' /> {t('routes.assessments.steps.9.no_missing_fields')}
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {Object.keys(riskAssessment.validation.errors)
              .filter((stepNr) => Number(stepNr) !== 9)
              .map((stepNr) => {
                const errorsForStep = riskAssessment.validation.errors[stepNr]?.errors;
                return (
                  <Grid item xs={12} key={stepNr}>
                    <Typography variant='body2'>
                      {stepNr}. {t(`routes.assessments.steps.${stepNr}.step_name`)}
                    </Typography>

                    <ul>
                      {Object.keys(errorsForStep).map((errorType) => {
                        let errorMessage = t(`routes.assessments.steps.${stepNr}.${camelToSnakeCase(errorType)}`);

                        if (errorMessage.includes('current_evaluation')) {
                          const category = camelToSnakeCase(errorType.split('.')[0]);
                          errorMessage = `${t(`routes.assessments.steps.${stepNr}.${category}`)}: ${t(
                            'routes.assessments.relevant_situation'
                          )}`;
                        } else if (errorMessage.includes('previous_evaluation')) {
                          const category = camelToSnakeCase(errorType.split('.')[0]);
                          errorMessage = `${t(`routes.assessments.steps.${stepNr}.${category}`)}: ${t(
                            'routes.assessments.previous_situation'
                          )}`;
                        } else if (errorType === 'submitted') {
                          errorMessage = t('errors.submitted');
                        } else if (errorMessage.includes('routes.')) {
                          // If we fail to automatically find a translation for the error type, we instead resort to
                          // pretty-printing the english version of the error.
                          errorMessage = capitalize(
                            camelToSnakeCase(errorType)
                              .split('_')
                              .reduce((s, c) => `${s} ${c}`, '')
                          );
                        }

                        return <li key={errorType}>{errorMessage}</li>;
                      })}
                    </ul>
                  </Grid>
                );
              })}
          </Grid>
        )}
      </Grid>

      <Grid item xs={12}>
        <Typography variant='h6' className='AssessmentSubHeader'>
          {t('routes.assessments.steps.9.final_evaluation')}
        </Typography>

        <Typography variant='body2' fontWeight={500}>
          {t('routes.assessments.steps.6.near_future_long')}
        </Typography>

        <Grid item xs={10} className='RiskAssessmentButtonGroup' marginBottom={2}>
          <ToggleButtonGroup value={step?.step6?.nearFutureRisk} disabled>
            {getAssessmentLevelButtonOptions(t).map((option) => (
              <ToggleButton
                key={option.value}
                className={clsx(option.value, 'ValueSelected')}
                value={option.value}
                disabled>
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Grid>

        <Typography variant='body2' fontWeight={500}>
          {t('routes.assessments.steps.6.severe_violence_long')}
        </Typography>

        <Grid item xs={10} className='RiskAssessmentButtonGroup' marginBottom={2}>
          <ToggleButtonGroup value={step?.step6?.severeViolenceRisk} disabled>
            {getAssessmentLevelButtonOptions(t).map((option) => (
              <ToggleButton
                key={option.value}
                className={clsx(option.value, 'ValueSelected')}
                value={option.value}
                disabled>
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Typography variant='h6' className='AssessmentSubHeader' style={{ marginBottom: 0 }}>
          {t('routes.assessments.steps.9.suggested_measures_victim')}:
        </Typography>

        {step?.allSuggestedMeasures?.aggressor?.length > 0 ? (
          <ul style={{ marginTop: '8px' }}>
            {(step?.allSuggestedMeasures?.victim || []).map((suggestedMeasure) => (
              <li key={suggestedMeasure.id}>
                <Typography variant='body2'>{t(`preventive_measures.${suggestedMeasure.type}`)}</Typography>
              </li>
            ))}
          </ul>
        ) : (
          <span>-</span>
        )}
      </Grid>

      <Grid item xs={12}>
        <Typography variant='h6' className='AssessmentSubHeader' style={{ marginBottom: 0 }}>
          {t('routes.assessments.steps.9.suggested_measures_aggressor')}:
        </Typography>

        {step?.allSuggestedMeasures?.aggressor?.length > 0 ? (
          <ul style={{ marginTop: '8px' }}>
            {step.allSuggestedMeasures?.aggressor.map((suggestedMeasure) => (
              <li key={suggestedMeasure.type}>
                <Typography variant='body2'>{t(`preventive_measures.${suggestedMeasure.type}`)}</Typography>
              </li>
            ))}
          </ul>
        ) : (
          <span>-</span>
        )}
      </Grid>

      <Grid item xs={12}>
        <Typography variant='h6' className='AssessmentSubHeader' style={{ marginBottom: '8px' }}>
          {t('routes.assessments.steps.9.sources_checked')}
        </Typography>

        <Typography variant='body2' className='WeakText' style={{ display: 'flex' }}>
          {t('routes.assessments.steps.9.update_by')}{' '}
          <Button
            variant='text'
            onClick={() => onChangeToStep(1)}
            className='InlineStepButton'
            startIcon={<StepIcon icon='1' style={{ width: '20px' }} />}>
            {t('routes.assessments.steps.1.step_name')}{' '}
          </Button>
        </Typography>

        {usedSources?.length > 0 ? (
          <ul>
            {usedSources.map((source) => (
              <li key={source.key}>{source.value}</li>
            ))}
          </ul>
        ) : (
          <span>-</span>
        )}
      </Grid>

      {!isExternal && (
        <Grid item xs={12} className='MoreThanTenDaysOld'>
          <Typography variant='h6' className='AssessmentSubHeader'>
            {t('routes.assessments.steps.9.10_days')}
          </Typography>

          <CheckBoxInput
            name='moreThanTenDaysOld'
            label={t('routes.assessments.steps.9.more_than_ten_days_old')}
            control={control}
            errors={errors}
            disabled={isReadOnly}
          />
          {!!(daysBetweenPoliceReportAndAssessmentStart && daysBetweenPoliceReportAndAssessmentStart > 10) && (
            <Typography variant='body1' className='WarningBubble WeakText'>
              {t('routes.assessments.steps.9.more_than_ten_days_old_warning', {
                days: daysBetweenPoliceReportAndAssessmentStart,
              })}
            </Typography>
          )}
        </Grid>
      )}

      <Grid item xs={12} className='StepButtonsContainer' style={{}}>
        <Button
          variant='outlined'
          onClick={() => onChangeToStep(stepNr - 1)}
          className='PrevButton'
          startIcon={<ArrowBackIcon />}>
          {t('common.actions.previous')}
        </Button>

        <Tooltip title={numMissingRequiredFields > 0 ? t('routes.assessments.steps.9.submit_disabled_tooltip') : ''}>
          <span className={numMissingRequiredFields > 0 ? 'FinishButtonContainer' : ''}>
            <Button
              variant='contained'
              onClick={() => onSubmitRiskAssessment()}
              className='FinishButton'
              disabled={numMissingRequiredFields > 0}>
              {t('common.actions.submit')}
            </Button>
          </span>
        </Tooltip>
      </Grid>

      <Modal
        title={t('routes.assessments.steps.9.submit_confirmation_title')}
        open={showConfirmSubmit}
        onClose={() => setShowConfirmSubmit(false)}
        actions={[
          {
            label: t('common.actions.cancel'),
            action: () => setShowConfirmSubmit(false),
            variant: 'text',
          },
          {
            label: t('common.actions.submit'),
            action: onConfirmSubmit,
            variant: 'contained',
          },
        ]}
        className='ConfirmModal'>
        <Typography variant='body2'>
          {t('routes.assessments.steps.9.submit_confirmation_content', {
            caseId: `S${prepadZeroes(riskAssessment?.case?.id)}`,
          })}
        </Typography>
      </Modal>

      <Modal
        title={t('routes.assessments.steps.9.submitted')}
        open={showSubmittedModal}
        onClose={() => setShowSubmittedModal(false)}
        actions={[
          {
            label: t('routes.assessments.steps.9.done'),
            action: () => navigate(`/cases/${riskAssessment.caseId}`),
            variant: 'contained',
          },
        ]}
        className='ConfirmModal'>
        <Grid
          item
          xs={12}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
          <Button
            endIcon={<PictureAsPdf />}
            variant='Text'
            className='SummaryButton'
            style={{ paddingLeft: 0 }}
            onClick={() => onClickDownloadPDF(riskAssessment.id, dispatch, t)}>
            {t('routes.assessments.steps.9.read_only.download_pdf')}
          </Button>
          <Button
            endIcon={<CopyAll />}
            variant='Text'
            className='SummaryButton'
            style={{ paddingLeft: 0 }}
            onClick={() => {
              {
                navigator.clipboard.writeText(window.location.href.split('steps')[0]);
                dispatch(showToast(t('routes.assessments.steps.9.copied'), 3000));
              }
            }}>
            {t('routes.assessments.steps.9.copy_link')}
          </Button>
        </Grid>
      </Modal>
    </Grid>
  );
};

export default React.memo(Step_9_Summary);
