/* eslint-disable react/prop-types */
import { memo, useEffect } from 'react';
import DateInput from '/components/forms/inputs/DateInput';
import { Grid, Typography, Button, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SelectInput from '/components/forms/inputs/SelectInput';
import TextInput from '/components/forms/inputs/TextInput';
import { AddCircle } from '@mui/icons-material';
import PropTypes from 'prop-types';
import InfoIconTooltip from '/components/common/InfoIconTooltip';
import RemoveIcon from '@mui/icons-material/Remove';
import ToggleButtonGroupInput from '/components/forms/inputs/ToggleButtonGroupInput';
import { INFORMATION_SOURCES } from '/util';
import { useFieldArray } from 'react-hook-form';
import { deleteSituation } from '/api/situations';
import { showToast } from '/modules/toast';
import { useDispatch } from 'react-redux';

/**
 *
 * This component renders all the fields for a common Risk Factor Evaluation
 *
 * @param {string} fieldName Name of the field which this risk factor evaluation is part of
 * @returns {JSX.Element} RiskFactorEvaluation
 */
const RiskFactorEvaluation = ({ fieldName, step, stepNr, control, errors, form, isReadOnly, isExternal }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const buttonOptions = [
    { name: 'J', label: t('components.toggle_button_group.j'), value: 'j' },
    { name: 'D', label: t('components.toggle_button_group.d'), value: 'd' },
    { name: 'N', label: t('components.toggle_button_group.n'), value: 'n' },
    { name: '-', label: t('components.toggle_button_group.insufficient'), value: 'no_info' },
  ];

  const {
    fields: currentSituations,
    append: appendCurrent,
    remove: removeCurrent,
    update: updateCurrent,
  } = useFieldArray({
    control,
    name: `${fieldName}.currentSituations`,
  });

  const {
    fields: previousSituations,
    append: appendPrevious,
    remove: removePrevious,
    update: updatePrevious,
  } = useFieldArray({
    control,
    name: `${fieldName}.previousSituations`,
  });

  /**
   * This useEffect gets the evaluation related to the given steps and sets current and previousSituations
   * This will replace all the fieldvalues with values from the server
   */
  useEffect(() => {
    if (step && step[fieldName] !== null) {
      if (step && Object.keys(step).includes(fieldName)) {
        step[fieldName].currentSituations.map((situation, index) => {
          updateCurrent(index, situation);
          updatePrevious(index, situation);
        });
      }
    }
  }, [step, stepNr]);

  const addCurrentSituation = () => {
    appendCurrent({
      date: null,
      source: null,
      sourceDescription: null,
      informationFromSource: null,
      situationId: null,
    });
  };

  const addPreviousSituation = () => {
    appendPrevious({
      date: null,
      source: null,
      sourceDescription: null,
      informationFromSource: null,
      situationId: null,
    });
  };

  const removeCurrentSituation = (situationToRemove, index) => {
    const evaluationId = step[fieldName].id;
    removeCurrent(index);
    if (situationToRemove.situationId !== null) {
      deleteSituation(evaluationId, situationToRemove.situationId);
    }
    dispatch(showToast(t('routes.risk_factor_evaluation.situation_deleted'), 3000));
  };

  const removePreviousSituation = (situationToRemove, index) => {
    const evaluationId = step[fieldName].id;
    removePrevious(index);
    if (situationToRemove.situationId !== null) {
      deleteSituation(evaluationId, situationToRemove.situationId);
    }
    dispatch(showToast(t('routes.risk_factor_evaluation.situation_deleted'), 3000));
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant='h6' className='SituationTitle'>
          {t('routes.assessments.relevant_situation')}
          <InfoIconTooltip text={t('routes.assessments.relevant_situation_description')} className='InfoIconTooltip' />
        </Typography>
      </Grid>
      <Grid item className='RiskFactorEvaluation'>
        {currentSituations?.map((situation, index) => {
          return (
            <Grid container spacing={2} paddingLeft={2} key={situation.id}>
              {index > 0 && (
                <>
                  <Grid item xs={12} marginTop={2} style={{ paddingLeft: '4px' }}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {!isReadOnly && (
                      <Button
                        key={situation.id}
                        variant='text'
                        className='StandaloneLine RemoveRelevantRiskFactorEvaluation'
                        onClick={() => removeCurrentSituation(situation, index)}
                        startIcon={<RemoveIcon />}>
                        {t('common.actions.remove')}
                      </Button>
                    )}
                  </Grid>
                </>
              )}

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <DateInput
                    key={situation.id}
                    name={`${fieldName}.currentSituations.${index}.date`}
                    label={t('common.strings.date')}
                    control={control}
                    errors={errors}
                    disabled={isReadOnly}
                    openTo='day'
                  />
                </Grid>
                <Grid item xs={8}>
                  <SelectInput
                    key={situation.id}
                    name={`${fieldName}.currentSituations.${index}.source`}
                    label={t('common.strings.source')}
                    options={INFORMATION_SOURCES}
                    control={control}
                    errors={errors}
                    gridStyle={{ flexDirection: 'row' }}
                    renderValue={(value) => t('routes.risk_factor_evaluation.source_value', { source: value })}
                    disabled={isReadOnly}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    key={situation.id}
                    name={`${fieldName}.currentSituations.${index}.sourceDescription`}
                    label={t('routes.risk_factor_evaluation.elaborating_source')}
                    control={control}
                    errors={errors}
                    helperText={t('routes.risk_factor_evaluation.source_help_text')}
                    disabled={isReadOnly}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    key={situation.id}
                    name={`${fieldName}.currentSituations.${index}.informationFromSource`}
                    label={t('routes.risk_factor_evaluation.information_from_source')}
                    control={control}
                    errors={errors}
                    multiline
                    fullWidth
                    rows={8}
                    disabled={isReadOnly}
                  />
                </Grid>
              </Grid>
            </Grid>
          );
        })}

        {!isReadOnly && (
          <Grid container item xs={12} paddingTop={2} paddingBottom={2}>
            <Button
              variant='text'
              className='StandaloneLink'
              onClick={() => addCurrentSituation()}
              startIcon={<AddCircle className='AddIcon' />}>
              {t('routes.risk_factor_evaluation.add_relevant_information')}
            </Button>
          </Grid>
        )}

        <Grid container item xs={12} marginTop={2}>
          <Typography variant='h6' className='SituationTitle'>
            {t('routes.assessments.previous_situation')}
            <InfoIconTooltip
              text={t('routes.assessments.previous_situation_description')}
              className='InfoIconTooltip'
            />
          </Typography>
        </Grid>

        {previousSituations?.map((situation, index) => {
          return (
            <Grid item xs={12} key={situation.id}>
              <Grid item xs={12} marginTop={2} marginBottom={2}>
                <Divider />
              </Grid>
              <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {!isReadOnly && (
                  <Button
                    key={situation.id}
                    variant='text'
                    className='StandaloneLine RemovePreviousRiskFactorEvaluation'
                    onClick={() => removePreviousSituation(situation, index)}
                    startIcon={<RemoveIcon />}>
                    {t('common.actions.remove')}
                  </Button>
                )}
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <DateInput
                    key={situation.id}
                    name={`${fieldName}.previousSituations.${index}.date`}
                    label={t('common.strings.date')}
                    control={control}
                    errors={errors}
                    disabled={isReadOnly}
                    openTo='day'
                  />
                </Grid>
                <Grid item xs={8}>
                  <SelectInput
                    key={situation.id}
                    name={`${fieldName}.previousSituations.${index}.source`}
                    label={t('common.strings.source')}
                    options={INFORMATION_SOURCES}
                    control={control}
                    errors={errors}
                    gridStyle={{ flexDirection: 'row' }}
                    renderValue={(value) => t('routes.risk_factor_evaluation.source_value', { source: value })}
                    disabled={isReadOnly}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    key={situation.id}
                    name={`${fieldName}.previousSituations.${index}.sourceDescription`}
                    label={t('routes.risk_factor_evaluation.elaborating_source')}
                    control={control}
                    errors={errors}
                    helperText={t('routes.risk_factor_evaluation.source_help_text')}
                    disabled={isReadOnly}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextInput
                    key={situation.id}
                    name={`${fieldName}.previousSituations.${index}.informationFromSource`}
                    label={t('routes.risk_factor_evaluation.information_from_source')}
                    control={control}
                    errors={errors}
                    multiline
                    fullWidth
                    rows={8}
                    disabled={isReadOnly}
                  />
                </Grid>
              </Grid>
            </Grid>
          );
        })}

        {!isReadOnly ? (
          <Grid item xs={12} paddingTop={2} paddingBottom={4}>
            <Button
              variant='text'
              className='StandaloneLink AddPreviousRiskFactorEvaluation'
              onClick={() => addPreviousSituation()}
              sx={{ alignItems: 'center' }}
              startIcon={<AddCircle className='AddIcon' />}>
              {t('routes.risk_factor_evaluation.add_previous_information')}
            </Button>
          </Grid>
        ) : (
          <Grid item xs={12} paddingTop={2} paddingBottom={4}>
            <Typography variant='body2' className='WeakText'>
              {t('routes.assessments.no_information')}
            </Typography>
          </Grid>
        )}
      </Grid>

      <Grid item className='EvaluationButtonGroup'>
        <Grid container item xs={6} style={{ alignItems: 'center' }}>
          <Typography variant='h6' xs={12} paddingBottom={1} className='SituationTitle'>
            {`${t('routes.assessments.relevant_situation')}${isExternal ? '' : ' *'}`}
          </Typography>
          <InfoIconTooltip
            text={t('routes.assessments.relevant_situation_description')}
            className='InfoIconTooltipMarginBottom'
          />
          <ToggleButtonGroupInput
            form={form}
            name={`${fieldName}.currentEvaluation`}
            options={buttonOptions}
            control={control}
            errors={errors}
            paddingTop={1}
            exclusive
            disabled={isReadOnly}
          />
        </Grid>

        <Grid container item xs={6} style={{ alignItems: 'center' }}>
          <Typography variant='h6' xs={12} paddingBottom={1} className='SituationTitle'>
            {`${t('routes.assessments.previous_situation')}${isExternal ? '' : ' *'}`}
          </Typography>
          <InfoIconTooltip
            text={t('routes.assessments.previous_situation_description')}
            className='InfoIconTooltipMarginBottom'
          />
          <ToggleButtonGroupInput
            form={form}
            name={`${fieldName}.previousEvaluation`}
            options={buttonOptions}
            control={control}
            errors={errors}
            paddingTop={1}
            exclusive
            disabled={isReadOnly}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

RiskFactorEvaluation.PropTypes = {
  riskAssessmentId: PropTypes.number.isRequired,
  fieldName: PropTypes.string.isRequired,
  step: PropTypes.object.isRequired,
  stepNr: PropTypes.number.isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  isExternal: PropTypes.bool.isRequired,
};

export default memo(RiskFactorEvaluation);
