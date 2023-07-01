/* eslint-disable react/prop-types */
import { memo } from 'react';
import { Grid, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SelectInput from '/components/forms/inputs/SelectInput';
import TextInput from '/components/forms/inputs/TextInput';
import PropTypes from 'prop-types';
import RemoveIcon from '@mui/icons-material/Remove';
import { useFieldArray } from 'react-hook-form';
import { showToast } from '/modules/toast';
import { useDispatch } from 'react-redux';
import { AddCircleOutline } from '@mui/icons-material';
import { deleteMeasure } from '/api/preventiveMeasures';
import { useParams } from 'react-router-dom';

/**
 * Dynamically renders measures that are displayed in Step 7 and 8
 *
 * @param {string} fieldName Name of the field where situations are stored
 * @returns {JSX.Element} DynamicMeasures
 */
const PreventiveMeasures = ({ fieldName, category, options, stepNr, control, errors, form, isReadOnly }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { riskAssessmentId } = useParams();
  const customCategory = category === 'custom';

  const {
    fields: measures,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `${fieldName}`,
  });

  const removeMeasure = (measureToRemove, index) => {
    remove(index);
    if (measureToRemove.measureId !== null && measureToRemove.measureId !== undefined) {
      deleteMeasure(riskAssessmentId, measureToRemove.measureId, stepNr);
    }
    dispatch(showToast(t('common.strings.measure_deleted'), 3000));
  };

  const handleChange = (e) => {
    append({ type: e.target.value, customMeasureName: null, comment: null });

    // These fields should never display their value, as they are only used to append measures to the list.
    if (customCategory) {
      form?.resetField(`text${fieldName}`);
    } else {
      form?.resetField(`select${fieldName}`);
    }
  };

  const handleAddCustomMeasure = () => {
    const customMeasureName = form?.getValues(`text${fieldName}`);
    if (customMeasureName !== undefined && customMeasureName.trim().length !== 0) {
      append({ type: 'other', customMeasureName: customMeasureName, comment: null });
    } else {
      dispatch(showToast(t('errors.missing_measure_name'), 3000, 'error'));
    }
    form?.resetField(`text${fieldName}`);
  };

  return (
    <>
      {!isReadOnly &&
        (customCategory ? (
          <Grid item xs={4} marginTop={1}>
            <TextInput
              name={`text${fieldName}`}
              label={t('routes.assessments.steps.7.measure_name')}
              control={control}
              errors={errors}
              InputProps={{
                endAdornment: (
                  /**
                   * Giving the classname to AddCircleOutline directly causes the mouse to change icon
                   * when hovering in between the lines of the icon.
                   * Applying the classname to an outer Grid fixes this issue
                   */
                  <Grid container item xs={3} className='AddCustomMeasureButton'>
                    <AddCircleOutline onClick={handleAddCustomMeasure} />
                  </Grid>
                ),
              }}
            />
          </Grid>
        ) : (
          <Grid item xs={8} marginTop={1}>
            <SelectInput
              name={`select${fieldName}`}
              label={t('common.strings.measure_list')}
              options={options}
              control={control}
              errors={errors}
              renderValue={(value) => t(`preventive_measures.${value}`)}
              selectProps={{ onChange: handleChange }}
              disabled={isReadOnly}
            />
          </Grid>
        ))}

      {isReadOnly && measures?.length === 0 ? (
        <Typography variant='body2' className='WeakText'>
          {t('routes.assessments.steps.7.no_measures_chosen')}
        </Typography>
      ) : (
        measures?.map((measure, index) => {
          return (
            <Grid container spacing={1} marginTop={1} key={measure.id}>
              <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0px' }}>
                {customCategory ? (
                  <Typography variant='h6'>{measure.customMeasureName}</Typography>
                ) : (
                  <Typography variant='h6' fontWeight={400}>
                    {t(`preventive_measures.${measure.type}`)}
                  </Typography>
                )}

                {!isReadOnly && (
                  <Button
                    key={measure.id}
                    variant='text'
                    className='StandaloneLine'
                    onClick={() => removeMeasure(measure, index)}
                    startIcon={<RemoveIcon />}>
                    {t('common.actions.remove')}
                  </Button>
                )}
              </Grid>

              <Grid item xs={12}>
                <TextInput
                  key={measure.id}
                  name={`${fieldName}.${index}.comment`}
                  label={t('routes.risk_factor_evaluation.elaborating_information')}
                  control={control}
                  errors={errors}
                  multiline
                  fullWidth
                  rows={3}
                  disabled={isReadOnly}
                />
              </Grid>
            </Grid>
          );
        })
      )}
    </>
  );
};

PreventiveMeasures.PropTypes = {
  fieldName: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  options: PropTypes.array,
  stepNr: PropTypes.number.isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
};

export default memo(PreventiveMeasures);
