import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import GenericFormInput from './GenericFormInput';
import { getFieldError } from '../../../util';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

/**
 * ToggleButtonGroup for forms. 'label' will be displayed separately on top. The 'options' array is required,
 * and it is on the form [{ label, name, value }, ...]
 * @param {string} name
 * @param {string} label
 * @param {object} control
 * @param {boolean} required
 * @param {object} validation
 * @param {object} errors
 * @param {object} gridStyle
 * @param {boolean} disabled
 * @param {string} helperText
 * @param {bool} exclusive
 * @param {number} xs
 * @returns {JSX.Element}
 */
const ToggleButtonGroupInput = ({
  form,
  name,
  label,
  control,
  required,
  validation,
  errors,
  gridStyle,
  disabled,
  exclusive,
  options,
  xs,
  includeHelperText,
}) => {
  const error = getFieldError(name, errors);
  const { t } = useTranslation();
  const [helperText, setHelperText] = useState('');

  const handleButtonClick = (e, newValue) => {
    if (includeHelperText) {
      setHelperText(t(`routes.assessments.${newValue === 'no_info' ? 'insufficient' : newValue}_description_short`));
    }
  };

  useEffect(() => {
    if (includeHelperText) {
      const currentValue = form?.getValues(`${name}`);
      if (currentValue !== null && currentValue !== undefined) {
        setHelperText(
          t(`routes.assessments.${currentValue === 'no_info' ? 'insufficient' : currentValue}_description_short`)
        );
      }
    }
  });

  return (
    <GenericFormInput
      name={name}
      errors={errors}
      control={control}
      required={required}
      validation={validation}
      gridStyle={gridStyle}
      helperText={helperText}
      error={error}
      xs={xs}
      render={({ field }) => {
        const id = field.label;
        return (
          <FormControl disabled={disabled} error={!!error} required={required}>
            <FormLabel id={id}>{label}</FormLabel>
            <ToggleButtonGroup
              value={field?.value === undefined ? null : field.value}
              exclusive={exclusive}
              aria-labelledby={id}
              disabled={disabled}
              {...field}>
              {options.map((option) => {
                return (
                  <ToggleButton
                    key={option.value}
                    className={clsx(option.value, field.value === null ? 'NoneSelected' : 'ValueSelected')}
                    value={option.value}
                    onClick={handleButtonClick}
                    disabled={disabled}>
                    {option.label}
                  </ToggleButton>
                );
              })}
            </ToggleButtonGroup>
          </FormControl>
        );
      }}
    />
  );
};

ToggleButtonGroupInput.propTypes = {
  form: PropTypes.object,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  control: PropTypes.any.isRequired,
  required: PropTypes.bool,
  validation: PropTypes.object,
  errors: PropTypes.object,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
  exclusive: PropTypes.bool,
  gridStyle: PropTypes.object,
  xs: PropTypes.number,
  includeHelperText: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
};

ToggleButtonGroupInput.defaultProps = {
  validation: {},
  fullWidth: true,
  xs: 12,
  gridStyle: {},
  exclusive: true,
  includeHelperText: true,
};

export default ToggleButtonGroupInput;
