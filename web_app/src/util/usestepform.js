import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import '/style/riskassessments.scss';

import { getRiskAssessment, updateStep } from '/modules/riskAssessments';
import { useForm } from 'react-hook-form';

import { showToast } from '/modules/toast';
import { useTranslation } from 'react-i18next';

/**
 * Hook that handles a lot of common functionality shared by risk assessment steps. Used to
 * reduce unneccesary repetition.
 * @param {{stepNr: number, defaultValues: object}}
 * @returns {object}
 */
const useStepForm = ({ stepNr, riskAssessment, step, defaultValues, isReadOnly }) => {
  const dispatch = useDispatch();
  const { riskAssessmentId } = useParams();
  const isLoading = useSelector((state) => state.riskAssessments.stepLoading);
  const [setErrors, setSetErrors] = useState(false);
  const { t } = useTranslation();

  // Form
  const {
    control,
    formState: { errors },
    ...form
  } = useForm({
    defaultValues,
    mode: 'onBlur',
  });
  // We perform the destructuring of form after using the useForm hook like this because it
  // lets us return the full form object.
  const { getValues, setError, reset } = form;

  // FIXME This useEffect is a bit scary. Do we risk deleting any input the user has been working on?
  useEffect(() => {
    if (step) {
      // If we don't include this merging, the "null" values from backend override any defaultValues
      // that we might want to use.
      const mergedStep = _.mergeWith({}, defaultValues, step, (a, b) => (b === null ? a : b));
      reset(mergedStep, { keepErrors: true });
    }
  }, [step, defaultValues]);

  // Save the form every 5 minutes
  useEffect(() => {
    if (!isReadOnly) {
      const id = setInterval(() => {
        onTempSave();
      }, 1000 * 60 * 5);
      return () => clearInterval(id);
    }
  }, [riskAssessmentId, stepNr, isReadOnly]);

  // This useEffect is responsible for taking valiation errors from the backend and set those errors on
  // the frontend form. We only want to do this when the user navigates back to a step after having
  // submitted it once.
  useEffect(() => {
    // setSetErrors is used for when we want to display errors from the backend. Without a check like this
    // we enter an infinite loop because the useEffect listens to the form prop.
    if (!setErrors && riskAssessment && stepNr && !riskAssessment.validation?.errors[stepNr]?.errors?.submitted) {
      const backendErrors = riskAssessment.validation?.errors[stepNr]?.errors || [];
      Object.keys(backendErrors).forEach((error, i) => {
        // FIXME Better error handling here
        const errorType = backendErrors[error] === 'Must not be null' ? 'required' : 'unknown';
        // FIXME This focusing doesn't seem to work
        const errorOptions = i === 0 ? { shouldFocus: true } : undefined;
        setError(error, { type: errorType }, errorOptions);
      });
      setSetErrors(true);
    }
  }, [riskAssessment, setErrors, stepNr]);

  const onTempSave = async () => {
    if (!isReadOnly) {
      const updatedStep = await dispatch(updateStep(riskAssessmentId, stepNr, { ...step, ...getValues() }, true));
      dispatch(showToast(t('routes.assessments.save_success'), 5000));
      return updatedStep;
    }
  };

  // Reset state when moving to a new form
  useEffect(() => {
    if (stepNr) {
      setSetErrors(false);
    }
  }, [stepNr, step]);

  const toReturn = useMemo(
    () => ({
      form,
      control,
      errors,
      onTempSave,
      isLoading,
    }),
    [stepNr, riskAssessment, step, defaultValues, isLoading, isReadOnly]
  );

  return toReturn;
};

useStepForm.propTypes = {
  stepNr: PropTypes.number.isRequired,
  step: PropTypes.object.isRequired,
  defaultValues: PropTypes.object,
  riskAssessment: PropTypes.object.isRequired,
  isReadOnly: PropTypes.bool,
};

useStepForm.defaultProps = {
  defaultValues: {},
  isReadOnly: false,
};

export default useStepForm;
