import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import GenericFormInput from './GenericFormInput';
import { getFieldError } from '../../../util';
import clsx from 'clsx';
import '/style/riskassessments.scss';

/**
 * Check Box input for forms.
 * @param {{ name: string, label: string, validation: object, control: object, errors: object, required: bool,
 *           selectProps: object, fullWidth: boolean, disabled: boolean, helperText: string }}
 * @returns {JSX.Element} - CheckBoxInput
 */
const CheckBoxInput = ({
  name,
  label,
  control,
  required,
  validation,
  errors,
  fullWidth,
  gridStyle,
  disabled,
  helperText,
  xs,
  ...props
}) => {
  const error = getFieldError(name, errors);
  return (
    <GenericFormInput
      name={name}
      errors={errors}
      control={control}
      required={required}
      validation={validation}
      helperText={helperText}
      gridStyle={gridStyle}
      error={error}
      xs={xs}
      render={({ field }) => (
        <FormControlLabel
          label={required && typeof label === 'string' ? `${label}${' *'}` : label}
          disabled={disabled}
          className={clsx('CheckBox', field?.className || '')}
          {...field}
          checked={!!field?.value}
          control={
            <Checkbox
              {...field}
              disabled={disabled}
              error={error}
              required={required}
              size='small'
              {...props}
              value={!!field?.value}
            />
          }
        />
      )}
    />
  );
};

CheckBoxInput.propTypes = {
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
};

CheckBoxInput.defaultProps = {
  validation: {},
  fullWidth: true,
  xs: 12,
  gridStyle: {},
};

export default CheckBoxInput;
