import { FormControl } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import GenericFormInput from './GenericFormInput';
import { getFieldError } from '../../../util';
import clsx from 'clsx';

/**
 * Date selector for forms.
 * @param {{ name: string, label: string, validation: object, control: object, errors: object, required: bool,
 *           selectProps: object, fullWidth: boolean, disabled: boolean, helperText: string }}
 * @returns {JSX.Element} - DateInput
 */
const DateInput = ({
  name,
  label,
  control,
  required,
  validation,
  errors,
  fullWidth,
  disabled,
  helperText,
  gridStyle,
  selectProps,
  openTo,
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
      helperText={!disabled ? helperText : undefined}
      fullWidth={fullWidth}
      gridStyle={gridStyle}
      error={error}
      render={({ field }) => (
        <FormControl fullWidth={fullWidth} required={required} disabled={disabled} error={!!error} {...props}>
          <DatePicker
            {...field}
            value={field.value ? dayjs(field.value) : null}
            label={label}
            disabled={disabled}
            className={clsx('DateInput', selectProps?.className || '')}
            {...selectProps}
            error={!!error}
            slotProps={{ textField: { error: !!error } }}
            views={['year', 'month', 'day']}
            openTo={openTo}
          />
        </FormControl>
      )}
    />
  );
};

DateInput.propTypes = {
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
  selectProps: PropTypes.object,
  openTo: PropTypes.string,
};

DateInput.defaultProps = {
  validation: {},
  fullWidth: true,
  gridStyle: {},
  openTo: 'day',
};

export default DateInput;
