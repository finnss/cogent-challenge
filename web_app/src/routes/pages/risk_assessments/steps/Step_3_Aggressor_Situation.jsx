import React from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import { Button, Divider, Grid, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TheoryAccordion from '/components/risk_assessments/TheoryAccordion';
import RiskFactorEvaluation from '/components/risk_assessments/RiskFactorEvaluation';
import PastSituations from '../../../../components/risk_assessments/PastSituations';
import '/style/riskassessments.scss';
import RadioButtonGroupInput from '/components/forms/inputs/RadioButtonGroupInput';
import ContentBox from '/components/common/ContentBox';

const Step_3_AggressorSituation = () => {
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

  return (
    <Grid container spacing={3} className='StepContent'>
      <Grid item xs={12}>
        <Typography variant='h5' style={{ fontWeight: '500' }}>
          {t('routes.assessments.steps.3.step_name')}
        </Typography>
        <Divider />
      </Grid>

      {/** Part 6. Other Crime */}
      <Grid item xs={12}>
        <ContentBox className='StepContentBox'>
          <Grid container item xs={12} marginBottom={3}>
            <TheoryAccordion
              text={t('routes.assessments.steps.3.relevant_theory_other_crime')}
              source={t('routes.assessments.steps.3.relevant_theory_source_other_crime')}
            />
            <Typography variant='h6' className='EvaluationTitle'>
              {t('routes.assessments.steps.3.six_other_crime')}
            </Typography>
            <ul className='EvaluationExplanation'>
              <li>
                <Typography variant='body2'>{t('routes.assessments.steps.3.other_crime_list_item1')}</Typography>
              </li>
              <li>
                <Typography variant='body2'>{t('routes.assessments.steps.3.other_crime_list_item2')}</Typography>
              </li>
              <li>
                <Typography variant='body2'>{t('routes.assessments.steps.3.other_crime_list_item3')}</Typography>
              </li>
            </ul>
          </Grid>

          <RiskFactorEvaluation
            fieldName='otherCrimeRiskEvaluation'
            step={step}
            stepNr={stepNr}
            control={control}
            errors={errors}
            form={form}
            isReadOnly={isReadOnly}
            isExternal={isExternal}
          />

          {step?.pastRiskAssessments?.length > 0 && (
            <PastSituations pastRiskAssessments={step.pastRiskAssessments} stepNr={stepNr} dataKey='otherCrime' />
          )}
        </ContentBox>
      </Grid>

      {/** Part 7.  Relationship Problems */}
      <Grid item xs={12}>
        <ContentBox className='StepContentBox'>
          <Grid container item xs={12} style={{ marginBottom: '24px' }}>
            <TheoryAccordion
              text={t('routes.assessments.steps.3.relevant_theory_relationship')}
              source={t('routes.assessments.steps.3.relevant_theory_source_relationship')}
            />
            <Typography variant='h6' className='EvaluationTitle'>
              {t('routes.assessments.steps.3.seven_relationship')}
            </Typography>
            <ul className='EvaluationExplanation'>
              <li>
                <Typography variant='body2'>
                  {t('routes.assessments.steps.3.relationship_problems_list_item1')}
                </Typography>
              </li>
              <li>
                <Typography variant='body2'>
                  {t('routes.assessments.steps.3.relationship_problems_list_item2')}
                </Typography>
              </li>
            </ul>

            <RiskFactorEvaluation
              fieldName='relationshipProblemsRiskEvaluation'
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
                dataKey='relationshipProblems'
              />
            )}
          </Grid>
        </ContentBox>
      </Grid>

      {/** Part 8.  Economy */}
      <Grid item xs={12}>
        <ContentBox className='StepContentBox'>
          <Grid container item xs={12} style={{ marginBottom: '24px' }}>
            <TheoryAccordion
              text={t('routes.assessments.steps.3.relevant_theory_economy')}
              source={t('routes.assessments.steps.3.relevant_theory_source_economy')}
            />
            <Typography variant='h6' className='EvaluationTitle'>
              {t('routes.assessments.steps.3.eight_economy')}
            </Typography>
            <ul className='EvaluationExplanation'>
              <li>
                <Typography variant='body2'>
                  {t('routes.assessments.steps.3.economical_problems_list_item1')}
                </Typography>
              </li>
            </ul>
            <RiskFactorEvaluation
              fieldName='economicalProblemsRiskEvaluation'
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
                dataKey='economicalProblems'
              />
            )}
          </Grid>
        </ContentBox>
      </Grid>

      {/** Part 9 Drugs */}
      <Grid item xs={12}>
        <ContentBox className='StepContentBox'>
          <Grid container item xs={12} style={{ marginBottom: '24px' }}>
            <TheoryAccordion
              text={t('routes.assessments.steps.3.relevant_theory_drugs')}
              source={t('routes.assessments.steps.3.relevant_theory_source_drugs')}
            />
            <Typography variant='h6' className='EvaluationTitle'>
              {t('routes.assessments.steps.3.nine_drugs')}
            </Typography>
            <ul className='EvaluationExplanation'>
              <li>
                <Typography variant='body2'>{t('routes.assessments.steps.3.drugs_list_item1')}</Typography>
              </li>
            </ul>

            <RiskFactorEvaluation
              fieldName='drugsRiskEvaluation'
              step={step}
              stepNr={stepNr}
              control={control}
              errors={errors}
              form={form}
              isReadOnly={isReadOnly}
              isExternal={isExternal}
            />

            {step?.pastRiskAssessments?.length > 0 && (
              <PastSituations pastRiskAssessments={step.pastRiskAssessments} stepNr={stepNr} dataKey='drugs' />
            )}
          </Grid>
        </ContentBox>
      </Grid>

      {/** Part 10. Psychological */}
      <Grid item xs={12}>
        <ContentBox className='StepContentBox'>
          <Grid container item xs={12} style={{ marginBottom: '24px' }}>
            <TheoryAccordion
              text={t('routes.assessments.steps.3.relevant_theory_psychological')}
              source={t('routes.assessments.steps.3.relevant_theory_source_psychological')}
            />
            <Typography variant='h6' className='EvaluationTitle'>
              {t('routes.assessments.steps.3.ten_psychological')}
            </Typography>
            <ul className='EvaluationExplanation'>
              <li>
                <Typography variant='body2'>
                  {t('routes.assessments.steps.3.psychological_problems_list_item1')}
                </Typography>
              </li>
              <li>
                <Typography variant='body2'>
                  {t('routes.assessments.steps.3.psychological_problems_list_item2')}
                </Typography>
              </li>
              <li>
                <Typography variant='body2'>
                  {t('routes.assessments.steps.3.psychological_problems_list_item3')}
                </Typography>
              </li>
              <li>
                <Typography variant='body2'>
                  {t('routes.assessments.steps.3.psychological_problems_list_item4')}
                </Typography>
              </li>
            </ul>

            <Grid item xs={12} className='PsychologicalEvaluation'>
              <RadioButtonGroupInput
                name='professionalPsychologicalEvaluation'
                options={[
                  {
                    name: 'confirmed',
                    label: t('common.strings.confirmed'),
                    value: true,
                    helperText: t('routes.assessments.steps.3.psychological_problems_confirmed_desc'),
                  },
                  {
                    name: 'assumed',
                    label: t('common.strings.assumed'),
                    value: false,
                    helperText: t('routes.assessments.steps.3.psychological_problems_assumed_desc'),
                  },
                ]}
                control={control}
                errors={errors}
                disabled={isReadOnly}
                required
              />
            </Grid>

            <RiskFactorEvaluation
              fieldName='psychologicalProblemsRiskEvaluation'
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
                dataKey='psychologicalProblems'
              />
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
          style={{ marginTop: '8px' }}
          endIcon={<ArrowForwardIcon />}>
          {t('common.actions.next')}
        </Button>
      </Grid>
    </Grid>
  );
};

export default React.memo(Step_3_AggressorSituation);
