import { FormHelperText, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';

/**
 * Generic Form Input that adds helper text and error information, if relevant. Should be
 * wrapped in a <Grid container>.
 * @returns {JSX.Element} - PersonFormModal
 */
const GenericFormInput = ({
  name,
  control,
  required,
  validation,
  helperText,
  render,
  xs,
  fullWidth,
  gridStyle,
  error,
}) => {
  const { t } = useTranslation();
  return (
    <Grid item container xs={xs} style={gridStyle} flexDirection='column'>
      <Grid item xs={xs} style={fullWidth ? { width: '100%' } : {}}>
        <Controller name={name} control={control} rules={{ required, ...validation }} error={error} render={render} />
      </Grid>
      {helperText && <FormHelperText className='WeakText'>{helperText}</FormHelperText>}

      {error && (
        <Grid item xs={xs}>
          <Typography role='alert' className='ErrorMessage'>
            {error.message || t(`errors.${error.type}`)}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

GenericFormInput.propTypes = {
  name: PropTypes.string.isRequired,
  errors: PropTypes.object,
  control: PropTypes.any.isRequired,
  required: PropTypes.bool,
  validation: PropTypes.object,
  helperText: PropTypes.string,
  render: PropTypes.func.isRequired,
  xs: PropTypes.number,
  fullWidth: PropTypes.bool,
  gridStyle: PropTypes.object,
  error: PropTypes.object,
};

GenericFormInput.defaultProps = {
  gridStyle: {},
};

export default GenericFormInput;
