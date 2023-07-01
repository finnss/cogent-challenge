import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import GenericFormInput from './GenericFormInput';
import { getFieldError } from '../../../util';
import React from 'react';

/**
 * Radio Input group for forms. 'label' will be displayed separately on top. The 'options' array is required,
 * and it is on the form [{ label, name, value }, ...]
 * @param {{ name: string, label: string, validation: object, control: object, errors: object, required: bool,
 *           selectProps: object, fullWidth: boolean, disabled: boolean, helperText: string, radioProps: import("@mui/material".RadioGroupProps) }}
 * @returns {JSX.Element} - CheckBoxInput
 */
const RadioButtonGroupInput = ({
  name,
  label,
  control,
  required,
  validation,
  errors,
  fullWidth,
  gridStyle,
  disabled,
  xs,
  options,
  radioProps,
}) => {
  const error = getFieldError(name, errors);
  return (
    <GenericFormInput
      name={name}
      errors={errors}
      control={control}
      required={required}
      validation={validation}
      gridStyle={gridStyle}
      error={error}
      xs={xs}
      render={({ field }) => {
        const id = field.label;
        return (
          <FormControl disabled={disabled} error={!!error} required={required}>
            <FormLabel id={id}>{label}</FormLabel>
            <RadioGroup
              {...radioProps}
              disabled={disabled}
              error={error}
              required={required}
              aria-labelledby={id}
              {...field}
              value={field?.value === undefined ? null : field.value}>
              {options.map((option) =>
                option.helperText ? (
                  // Fragment needs key to supress warnings
                  <React.Fragment key={option.label}>
                    <FormControlLabel key={option.label} {...option} control={<Radio size='small' />} />
                    <Typography key={`${option.label}-text`} variant='body2' className='RadioHelperText WeakText'>
                      {option.helperText}
                    </Typography>
                  </React.Fragment>
                ) : (
                  <FormControlLabel key={option.label} {...option} control={<Radio size='small' />} />
                )
              )}
            </RadioGroup>
          </FormControl>
        );
      }}
    />
  );
};

RadioButtonGroupInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.any,
  control: PropTypes.any.isRequired,
  required: PropTypes.bool,
  validation: PropTypes.object,
  errors: PropTypes.object,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
  gridStyle: PropTypes.object,
  xs: PropTypes.number,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  radioProps: PropTypes.object,
};

RadioButtonGroupInput.defaultProps = {
  validation: {},
  fullWidth: true,
  xs: 12,
  gridStyle: {},
};

export default RadioButtonGroupInput;
