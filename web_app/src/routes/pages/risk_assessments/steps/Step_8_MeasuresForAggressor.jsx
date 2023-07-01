import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Button, Divider, Grid, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '/style/riskassessments.scss';
import ContentBox from '/components/common/ContentBox';
import PreventiveMeasures from '../../../../components/risk_assessments/PreventiveMeasures';
import { PREVENTIVE_MEASURES } from '/util';

const Step_8_MeasuresForAggressor = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { riskAssessment, step, stepNr, form, control, errors, onTempSave, onChangeToStep, isLoading, isReadOnly } =
    useOutletContext();

  return (
    <Grid container spacing={3} className='StepContent'>
      <Grid item xs={12}>
        <Typography variant='h3' className='StepHeader'>
          {t('routes.assessments.steps.8.step_header_name')}
        </Typography>
        <Typography variant='body2' className='WeakText' marginTop={1} marginBottom={1}>
          {t('routes.assessments.steps.7.step_header_desc')}
        </Typography>
        <Divider />
      </Grid>

      {/** Police measures */}
      <Grid item xs={12}>
        <ContentBox>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant='h6'>{t('routes.assessments.steps.7.category_police')}</Typography>
            </Grid>
          </Grid>
          <PreventiveMeasures
            fieldName='policePreventiveMeasures'
            category='police'
            options={PREVENTIVE_MEASURES.AGGRESSOR.POLICE}
            step={step}
            stepNr={stepNr}
            control={control}
            errors={errors}
            form={form}
            isReadOnly={isReadOnly}
          />
        </ContentBox>
      </Grid>

      {/** Health measures */}
      <Grid item xs={12}>
        <ContentBox>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant='h6'>{t('routes.assessments.steps.7.category_health')}</Typography>
            </Grid>
          </Grid>
          <PreventiveMeasures
            fieldName='healthPreventiveMeasures'
            category='health'
            options={PREVENTIVE_MEASURES.AGGRESSOR.HEALTH}
            step={step}
            stepNr={stepNr}
            control={control}
            errors={errors}
            form={form}
            isReadOnly={isReadOnly}
          />
        </ContentBox>
      </Grid>

      {/** Official measures */}
      <Grid item xs={12}>
        <ContentBox>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant='h6'>{t('routes.assessments.steps.7.category_official')}</Typography>
            </Grid>
          </Grid>
          <PreventiveMeasures
            fieldName='officialPreventiveMeasures'
            category='official'
            options={PREVENTIVE_MEASURES.AGGRESSOR.OFFICIAL}
            step={step}
            stepNr={stepNr}
            control={control}
            errors={errors}
            form={form}
            isReadOnly={isReadOnly}
          />
        </ContentBox>
      </Grid>

      {/** Other measures */}
      <Grid item xs={12}>
        <ContentBox>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant='h6'>{t('routes.assessments.steps.7.category_other')}</Typography>
            </Grid>
          </Grid>
          <PreventiveMeasures
            fieldName='otherPreventiveMeasures'
            category='other'
            options={PREVENTIVE_MEASURES.AGGRESSOR.OTHER}
            step={step}
            stepNr={stepNr}
            control={control}
            errors={errors}
            form={form}
            isReadOnly={isReadOnly}
          />
        </ContentBox>
      </Grid>

      {/** Custom measures */}
      <Grid item xs={12}>
        <ContentBox>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant='h6'>{t('routes.assessments.steps.7.category_custom')}</Typography>
            </Grid>
          </Grid>
          <PreventiveMeasures
            fieldName='customPreventiveMeasures'
            category='custom'
            step={step}
            stepNr={stepNr}
            control={control}
            errors={errors}
            form={form}
            isReadOnly={isReadOnly}
          />
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

        {isReadOnly ? (
          <Button
            variant='contained'
            onClick={() => navigate(`/cases/${riskAssessment?.case?.id}`)}
            className='FinishButton'>
            {t('routes.assessments.steps.8.close_risk_assessment')}
          </Button>
        ) : (
          <Button
            variant='contained'
            onClick={() => onChangeToStep(stepNr + 1)}
            className='NextButton'
            endIcon={<ArrowForwardIcon />}>
            {t('common.actions.next')}
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default React.memo(Step_8_MeasuresForAggressor);
