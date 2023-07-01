import { TextField } from '@mui/material';
import PropTypes from 'prop-types';
import GenericFormInput from './GenericFormInput';
import { getFieldError } from '../../../util';

/**
 * Text input in a forn.
 * @param {{ name: string, label: string, validation: object, control: object, errors: object, required: bool,
 *           selectProps: object, fullWidth: boolean, disabled: boolean, helperText: string }}
 * @returns {JSX.Element} - TextInput
 */
const TextInput = ({
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
        <TextField
          {...field}
          label={label}
          // FIXME: Very unsure if this empty string as default is a good idea. Might screw with validation? (finnss)
          value={field.value || ''}
          fullWidth={fullWidth}
          disabled={disabled}
          error={!!error}
          required={required}
          {...props}
        />
      )}
    />
  );
};

TextInput.propTypes = {
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

TextInput.defaultProps = {
  validation: {},
  fullWidth: true,
  xs: 12,
  gridStyle: {},
};

export default TextInput;
