import React from 'react';
import { useTranslation } from 'react-i18next';

import { useOutletContext } from 'react-router-dom';
import { Button, Divider, Grid, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TheoryAccordion from '/components/risk_assessments/TheoryAccordion';
import RiskFactorEvaluation from '../../../../components/risk_assessments/RiskFactorEvaluation';
import '/style/riskassessments.scss';
import ContentBox from '/components/common/ContentBox';
import PastSituations from '/components/risk_assessments/PastSituations';

const Step_2_AggressorRiskFactors = () => {
  const { t } = useTranslation();
  const { step, stepNr, form, control, errors, onChangeToStep, isReadOnly, isExternal } = useOutletContext();

  return (
    <Grid container spacing={3} className='StepContent'>
      <Grid item xs={12}>
        <ContentBox className='BlueBorder'>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant='h6' className='TitleTextRiskAssessment'>
                {t('routes.assessments.assessment_procedure')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' className='WeakText'>
                {t('routes.assessments.j_description_long')}
              </Typography>
              <Typography variant='body2' className='WeakText'>
                {t('routes.assessments.d_description_long')}
              </Typography>
              <Typography variant='body2' className='WeakText'>
                {t('routes.assessments.n_description_long')}
              </Typography>
              <Typography variant='body2' className='WeakText'>
                {t('routes.assessments.insufficient_description_long')}
              </Typography>
            </Grid>
            <Grid item xs={12} marginBottom={2}>
              <Typography variant='h6' className='TitleTextRiskAssessment'>
                {t('routes.assessments.relevant_situation')}
              </Typography>
              <Typography variant='body2' className='WeakText'>
                {t('routes.assessments.relevant_situation_description')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h6' className='TitleTextRiskAssessment'>
                {t('routes.assessments.previous_situation')}
              </Typography>
              <Typography variant='body2' className='WeakText'>
                {t('routes.assessments.previous_situation_description')}
              </Typography>
            </Grid>
          </Grid>
        </ContentBox>
      </Grid>

      <Grid item xs={12}>
        <Typography variant='h5' fontWeight={500}>
          {t('routes.assessments.steps.2.step_name')}
        </Typography>
        <Typography variant='body2' className='WeakText'>
          {t('routes.assessments.steps.2.step_description')}
        </Typography>
        <Divider />
      </Grid>

      {/** Part 1. Violence */}
      <Grid item xs={12}>
        <ContentBox>
          <Grid container item xs={12}>
            <TheoryAccordion
              text={t('routes.assessments.steps.2.relevant_theory_violence')}
              source={t('routes.assessments.steps.2.relevant_theory_source_violence')}
            />
            <Typography variant='h6' className='EvaluationTitle'>
              {t('routes.assessments.steps.2.one_violence')}
            </Typography>
            <ul className='EvaluationExplanation'>
              <li>
                <Typography variant='body2'>{t('routes.assessments.steps.2.violence_list_item1')}</Typography>
              </li>
              <li>
                <Typography variant='body2'>{t('routes.assessments.steps.2.violence_list_item2')}</Typography>
              </li>
              <li>
                <Typography variant='body2'>{t('routes.assessments.steps.2.violence_list_item3')}</Typography>
              </li>
            </ul>
          </Grid>

          <RiskFactorEvaluation
            fieldName={'violenceRiskEvaluation'}
            step={step}
            stepNr={stepNr}
            control={control}
            errors={errors}
            form={form}
            isReadOnly={isReadOnly}
            isExternal={isExternal}
          />

          {step?.pastRiskAssessments?.length > 0 && (
            <PastSituations pastRiskAssessments={step.pastRiskAssessments} stepNr={stepNr} dataKey='violence' />
          )}
        </ContentBox>
      </Grid>

      {/** Part 2. Threat */}
      <Grid item xs={12}>
        <ContentBox>
          <Grid container item xs={12} marginBottom={5}>
            <TheoryAccordion
              text={t('routes.assessments.steps.2.relevant_theory_threat')}
              source={t('routes.assessments.steps.2.relevant_theory_source_threat')}
            />
            <Typography variant='h6' className='EvaluationTitle'>
              {t('routes.assessments.steps.2.two_threat')}
            </Typography>
            <ul className='EvaluationExplanation'>
              <li>
                <Typography variant='body2'>{t('routes.assessments.steps.2.threat_list_item1')}</Typography>
              </li>
              <li>
                <Typography variant='body2'>{t('routes.assessments.steps.2.threat_list_item2')}</Typography>
              </li>
              <li>
                <Typography variant='body2'>{t('routes.assessments.steps.2.threat_list_item3')}</Typography>
              </li>
              <li>
                <Typography variant='body2'>{t('routes.assessments.steps.2.threat_list_item4')}</Typography>
              </li>
            </ul>

            <RiskFactorEvaluation
              fieldName='threatRiskEvaluation'
              step={step}
              stepNr={stepNr}
              control={control}
              errors={errors}
              form={form}
              isReadOnly={isReadOnly}
              isExternal={isExternal}
            />

            {step?.pastRiskAssessments?.length > 0 && (
              <PastSituations pastRiskAssessments={step.pastRiskAssessments} stepNr={stepNr} dataKey='threat' />
            )}
          </Grid>
        </ContentBox>
      </Grid>

      {/** Part 3. Escalation */}
      <Grid item xs={12}>
        <ContentBox>
          <Grid container item xs={12} marginBottom={5}>
            <TheoryAccordion
              text={t('routes.assessments.steps.2.relevant_theory_escalation')}
              source={t('routes.assessments.steps.2.relevant_theory_source_escalation')}
            />
            <Typography variant='h6' className='EvaluationTitle'>
              {t('routes.assessments.steps.2.three_escalation')}
            </Typography>
            <ul className='EvaluationExplanation'>
              <li>
                <Typography variant='body2'>{t('routes.assessments.steps.2.escalation_list_item1')}</Typography>
              </li>
              <li>
                <Typography variant='body2'>{t('routes.assessments.steps.2.escalation_list_item2')}</Typography>
              </li>
              <li>
                <Typography variant='body2'>{t('routes.assessments.steps.2.escalation_list_item3')}</Typography>
              </li>
            </ul>
            <RiskFactorEvaluation
              fieldName='escalationRiskEvaluation'
              step={step}
              stepNr={stepNr}
              control={control}
              errors={errors}
              form={form}
              isReadOnly={isReadOnly}
              isExternal={isExternal}
            />

            {step?.pastRiskAssessments?.length > 0 && (
              <PastSituations pastRiskAssessments={step.pastRiskAssessments} stepNr={stepNr} dataKey='escalation' />
            )}
          </Grid>
        </ContentBox>
      </Grid>

      {/** Part 4. Restraining violation */}
      <Grid item xs={12}>
        <ContentBox className='StepContentBox'>
          <Grid container item xs={12} marginBottom={5}>
            <TheoryAccordion
              text={t('routes.assessments.steps.2.relevant_theory_restraining_violation')}
              source={t('routes.assessments.steps.2.relevant_theory_source_restraining_violation')}
            />
            <Typography variant='h6' className='EvaluationTitle'>
              {t('routes.assessments.steps.2.four_restraining_violation')}
            </Typography>
            <ul className='EvaluationExplanation'>
              <li>
                <Typography variant='body2'>
                  {t('routes.assessments.steps.2.restraining_violation_list_item1')}
                </Typography>
              </li>
              <li>
                <Typography variant='body2'>
                  {t('routes.assessments.steps.2.restraining_violation_list_item2')}
                </Typography>
              </li>
              <li>
                <Typography variant='body2'>
                  {t('routes.assessments.steps.2.restraining_violation_list_item3')}
                </Typography>
              </li>
            </ul>

            <RiskFactorEvaluation
              fieldName='restrainingViolationRiskEvaluation'
              step={step}
              stepNr={stepNr}
              control={control}
              errors={errors}
              form={form}
              isReadOnly={isReadOnly}
              isExternal={isExternal}
            />

            {step?.pastRiskAssessments?.length > 0 && (
              <PastSituations
                pastRiskAssessments={step.pastRiskAssessments}
                stepNr={stepNr}
                dataKey='restrainingViolation'
              />
            )}
          </Grid>
        </ContentBox>
      </Grid>

      {/** Part 5. Attitude */}
      <Grid item xs={12}>
        <ContentBox className='StepContentBox'>
          <Grid container item xs={12} marginBottom={5}>
            <TheoryAccordion
              text={t('routes.assessments.steps.2.relevant_theory_attitude')}
              source={t('routes.assessments.steps.2.relevant_theory_source_attitude')}
            />
            <Typography variant='h6' className='EvaluationTitle'>
              {t('routes.assessments.steps.2.five_attitude')}
            </Typography>
            <ul className='EvaluationExplanation'>
              <li>
                <Typography variant='body2'>{t('routes.assessments.steps.2.attitude_list_item1')}</Typography>
              </li>
              <li>
                <Typography variant='body2'>{t('routes.assessments.steps.2.attitude_list_item2')}</Typography>
              </li>
              <li>
                <Typography variant='body2'>{t('routes.assessments.steps.2.attitude_list_item3')}</Typography>
              </li>
            </ul>

            <RiskFactorEvaluation
              fieldName='attitudeRiskEvaluation'
              step={step}
              stepNr={stepNr}
              control={control}
              errors={errors}
              form={form}
              isReadOnly={isReadOnly}
              isExternal={isExternal}
            />

            {step?.pastRiskAssessments?.length > 0 && (
              <PastSituations pastRiskAssessments={step.pastRiskAssessments} stepNr={stepNr} dataKey='attitude' />
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

export default React.memo(Step_2_AggressorRiskFactors);
