import { memo, useState, useMemo, useEffect } from 'react';
import { Box, Stepper, Step, StepButton, Grid, Button, Typography, StepLabel, StepConnector } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import '/style/riskassessments.scss';

import { dateTime } from '/util/formatters';

const StepMenu = ({ riskAssessment, stepNr, onTempSave, onChangeToStep, isReadOnly }) => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(stepNr ? stepNr - 1 : -1);
  const [updatedAt, setUpdatedAt] = useState();

  useEffect(() => {
    setActiveStep(stepNr ? stepNr - 1 : -1);
  }, [stepNr]);

  const handleStepClick = (stepNumber) => () => {
    if (riskAssessment) {
      onChangeToStep(stepNumber);
    }
  };

  const isStepComplete = (stepNumber) => {
    if (!riskAssessment || !riskAssessment?.validation) return false;
    return (
      riskAssessment.validation.valid ||
      !riskAssessment.validation.errors ||
      !riskAssessment.validation.errors[stepNumber] ||
      riskAssessment.validation.errors[stepNumber].valid
    );
  };

  const stepHasError = (stepNumber) => {
    if (!riskAssessment || !riskAssessment?.validation?.errors) return false;
    return (
      riskAssessment.validation.errors[stepNumber] &&
      !riskAssessment.validation.errors[stepNumber].valid &&
      !riskAssessment.validation.errors[stepNumber].errors.submitted
    );
  };

  const steps = useMemo(
    () => [
      {
        label: t('routes.assessments.steps.1.step_name'),
        completed: isStepComplete(1),
        hasError: stepHasError(1),
      },
      {
        label: t('routes.assessments.steps.2.step_name'),
        completed: isStepComplete(2),
        hasError: stepHasError(2),
      },
      {
        label: t('routes.assessments.steps.3.step_name'),
        completed: isStepComplete(3),
        hasError: stepHasError(3),
      },
      {
        label: t('routes.assessments.steps.4.step_name'),
        completed: isStepComplete(4),
        hasError: stepHasError(4),
      },
      {
        label: t('routes.assessments.steps.5.step_name'),
        completed: isStepComplete(5),
        hasError: stepHasError(5),
      },
      {
        label: t('routes.assessments.steps.6.step_name'),
        completed: isStepComplete(6),
        hasError: stepHasError(6),
      },
      {
        label: t('routes.assessments.steps.7.step_name'),
        completed: isStepComplete(7),
        hasError: stepHasError(7),
      },
      {
        label: t('routes.assessments.steps.8.step_name'),
        completed: isStepComplete(8),
        hasError: stepHasError(8),
      },
      {
        label: t('routes.assessments.steps.9.step_name'),
        completed: isStepComplete(9),
        hasError: stepHasError(9),
      },
    ],
    [riskAssessment, riskAssessment?.validation]
  );

  const ErrorIcon = () => <ErrorOutlineIcon className='ErrorIcon' color='red' width='20px' />;

  useEffect(() => {
    if (riskAssessment?.updatedAt && (!updatedAt || riskAssessment?.updatedAt > updatedAt)) {
      setUpdatedAt(riskAssessment?.updatedAt);
    }
  }, [riskAssessment?.updatedAt]);

  const onClickTempSave = async () => {
    const updatedStep = await onTempSave();
    if (updatedStep?.updatedAt && (!updatedAt || updatedStep.updatedAt > updatedAt)) {
      setUpdatedAt(updatedStep?.updatedAt);
    }
  };

  return (
    <Grid container spacing={6} flexDirection='column' className='StepMenuContainer'>
      <Grid item xs={12}>
        <Box className='StepMenu'>
          <Stepper activeStep={activeStep} orientation='vertical' nonLinear>
            {/* Show Summary as Step "0" if we are in read only mode */}
            {isReadOnly && (
              <>
                <Step key='initial_summary' index={0} active={activeStep === 8}>
                  <StepButton color='inherit' onClick={handleStepClick(9)} icon={`${0}`}>
                    <StepLabel>{t('routes.assessments.steps.9.step_name')}</StepLabel>
                  </StepButton>
                </Step>
                <StepConnector />
              </>
            )}

            {steps
              .filter((_, index) => (isReadOnly ? index < 8 : true))
              .map((step, index) => (
                <Step key={step.label} completed={step.completed && !isReadOnly} index={index}>
                  <StepButton color='inherit' onClick={handleStepClick(index + 1)} icon={`${index + 1}`}>
                    <StepLabel
                      error={!isReadOnly && step.hasError}
                      StepIconComponent={!isReadOnly && step.hasError ? ErrorIcon : undefined}>
                      {step.label}
                    </StepLabel>
                  </StepButton>
                </Step>
              ))}
          </Stepper>
        </Box>
      </Grid>

      <Grid item xs={12}>
        {!isReadOnly && (
          <Button variant='outlined' startIcon={<SaveAltIcon />} className='SaveTemp' onClick={onClickTempSave}>
            {t('routes.assessments.save_temp')}
          </Button>
        )}

        {updatedAt && (
          <Typography className='WeakText UpdatedAt'>
            {t('common.strings.updated_at')} {dateTime(updatedAt, true, true)}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

StepMenu.propTypes = {
  riskAssessment: PropTypes.object,
  stepNr: PropTypes.number,
  onTempSave: PropTypes.func.isRequired,
  onChangeToStep: PropTypes.func.isRequired,
  breadcrumbs: PropTypes.object,
  isReadOnly: PropTypes.bool,
};

export default memo(StepMenu);
