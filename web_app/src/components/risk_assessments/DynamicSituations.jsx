/* eslint-disable react/prop-types */
import { memo } from 'react';
import DateInput from '/components/forms/inputs/DateInput';
import { Grid, Button, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SelectInput from '/components/forms/inputs/SelectInput';
import TextInput from '/components/forms/inputs/TextInput';
import { AddCircle } from '@mui/icons-material';
import PropTypes from 'prop-types';
import RemoveIcon from '@mui/icons-material/Remove';
import { INFORMATION_SOURCES } from '/util';
import { useFieldArray } from 'react-hook-form';
import { deleteSituation } from '/api/situations';
import { showToast } from '/modules/toast';
import { useDispatch } from 'react-redux';

/**
 *
 * This component dynamically renders all fields common for
 * a situation (date, source, sourceDescription and informationFromSource).
 *
 * It is used in cases where we want to store situations in a list when
 * the situations are not part of RiskFactorEvaluation.
 *
 * @param {string} fieldName Name of the field where situations are stored
 * @returns {JSX.Element} DynamicSituations
 */
const DynamicSituations = ({ fieldName, step, stepNr, control, errors, form, isReadOnly }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    fields: situations,
    append,
    remove,
    replace,
    update,
  } = useFieldArray({
    control,
    name: `${fieldName}`,
  });

  const addSituation = () => {
    append({
      date: null,
      source: null,
      sourceDescription: null,
      informationFromSource: null,
      situationId: null,
    });
  };

  const removeSituation = (situationToRemove, index) => {
    const evaluationId = step[fieldName].id;
    remove(index);
    if (situationToRemove.situationId !== null) {
      deleteSituation(evaluationId, situationToRemove.situationId);
    }
    dispatch(showToast(t('routes.risk_factor_evaluation.situation_deleted'), 3000));
  };

  return (
    <Grid container>
      {situations?.map((situation, index) => {
        return (
          <Grid container spacing={2} paddingLeft={2} key={situation.id}>
            {index > 0 && (
              <>
                <Grid item xs={12} marginTop={2} paddingLeft={0.5}>
                  <Divider />
                </Grid>
                <Grid container item xs={12} style={{ justifyContent: 'flex-end' }}>
                  {!isReadOnly && (
                    <Button
                      key={situation.id}
                      variant='text'
                      className='StandaloneLine RemoveRelevantRiskFactorEvaluation'
                      onClick={() => removeSituation(situation, index)}
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
                  name={`${fieldName}.${index}.date`}
                  label={t('common.strings.date')}
                  control={control}
                  errors={errors}
                  disabled={isReadOnly}
                />
              </Grid>
              <Grid item xs={8}>
                <SelectInput
                  key={situation.id}
                  name={`${fieldName}.${index}.source`}
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
                  name={`${fieldName}.${index}.sourceDescription`}
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
                  name={`${fieldName}.${index}.informationFromSource`}
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
            onClick={() => addSituation()}
            startIcon={<AddCircle className='AddIcon' />}
            style={{ paddingLeft: '2px' }}>
            {t('routes.risk_factor_evaluation.add_more_information')}
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

DynamicSituations.PropTypes = {
  fieldName: PropTypes.string.isRequired,
  step: PropTypes.object.isRequired,
  stepNr: PropTypes.number.isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
};

export default memo(DynamicSituations);
