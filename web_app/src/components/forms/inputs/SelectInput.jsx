import PropTypes from 'prop-types';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import GenericFormInput from './GenericFormInput';
import { getFieldError } from '../../../util';

/**
 * Select Component
 * @param {{ name: string, label: string, validation: object, control: object, errors: object, required: bool,
 *           selectProps: object, helperText: string }}
 * @returns {JSX.Element} - SelectInput
 */
const SelectInput = ({
  options,
  name,
  label,
  validation,
  control,
  errors,
  required,
  disabled,
  selectProps,
  helperText,
  gridStyle,
  fullWidth,
  renderValue,
  ...props
}) => {
  const { t } = useTranslation();
  const error = getFieldError(name, errors);
  const labelId = `${name}-label`;
  return (
    <GenericFormInput
      name={name}
      errors={errors}
      control={control}
      required={required}
      validation={validation}
      helperText={helperText}
      fullWidth={fullWidth}
      gridStyle={gridStyle}
      disabled={disabled}
      error={error}
      render={({ field }) => (
        <FormControl fullWidth={fullWidth} required={required} disabled={disabled} error={!!error} {...props}>
          <InputLabel id={labelId} disabled={disabled}>
            {label}
          </InputLabel>
          <Select
            style={{ width: '100%' }}
            {...field}
            {...selectProps}
            label={label}
            labelId={labelId}
            disabled={disabled}
            error={!!error}
            value={field?.value === undefined || field?.value === null ? '' : field.value}
            size='small'>
            {options?.map((value) => (
              <MenuItem key={value} value={value} disabled={disabled}>
                {value === 'remove' ? (
                  field?.value === value ? (
                    ''
                  ) : (
                    <span className='Italic'>{t('common.strings.none')}</span>
                  )
                ) : (
                  renderValue(value)
                )}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  );
};

SelectInput.propTypes = {
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.any,
  control: PropTypes.any.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  validation: PropTypes.object,
  errors: PropTypes.object,
  selectProps: PropTypes.object,
  fullWidth: PropTypes.bool,
  helperText: PropTypes.string,
  gridStyle: PropTypes.object,
  renderValue: PropTypes.func,
  onChange: PropTypes.func,
};

SelectInput.defaultProps = {
  validation: {},
  renderValue: (value) => value,
  gridStyle: {},
  fullWidth: true,
};

export default SelectInput;
