import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { nbNO } from '@mui/material/locale';
import variables from '/style/variables.scss';
import colors from '/style/colors.scss';

const muiTheme = createTheme(
  {
    palette: {
      primary: {
        main: variables.colorPrimary,
      },
      secondary: {
        main: variables.colorSecondary,
      },
      error: {
        main: variables.colorError,
      },
      warning: {
        main: variables.colorWarning,
      },
      success: {
        main: variables.colorSuccess,
      },
      interactive: {
        main: variables.colorInteractive,
        contrastText: '#fff',
      },
      interactiveSecondary: {
        main: variables.colorInteractiveSecondary,
        contrastText: '#000',
      },
      background: { default: variables.backgroundDefault },
    },
    spacing: parseInt(variables.spacing),
    transitions: {
      easing: {
        easeInOut: variables['transition-easeInOut'],
        easeOut: variables['transition-easeOut'],
        easeIn: variables['transition-easeIn'],
        sharp: variables['transition-sharp'],
      },
    },
    zIndex: {
      appBar: variables['appbar-zindex'],
      drawer: variables['drawer-zindex'],
    },
    typography: {
      subtitle1: { fontSize: '1.125rem' },
      subtitle2: { fontSize: '1rem' },
      body1: { fontSize: '1.125rem' },
      body2: { fontSize: '1rem' },
    },
    components: {
      MuiTable: {
        defaultProps: {
          size: 'small',
        },
      },
      MuiButton: {
        defaultProps: {
          color: 'interactive',
        },
        styleOverrides: {
          root: {
            minWidth: 'max-content',
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          // override the "indicator" color
          indicator: { backgroundColor: variables.colorInteractive },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            '&.Mui-selected': { color: variables.colorInteractive },
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          size: 'small',
          variant: 'outlined',
        },
      },
      MuiFormControl: {
        defaultProps: {
          size: 'small',
          variant: 'outlined',
        },
      },
      MuiAlert: {
        defaultProps: {
          variant: 'outlined',
        },
        styleOverrides: {
          outlined: {
            backgroundColor: variables.backgroundDefault,
          },
        },
      },
      MuiLink: {
        defaultProps: {
          underline: 'hover',
          color: colors.pitBlueLink,
        },
      },
      MuiAutocomplete: {
        defaultProps: {
          autoHighlight: true,
          openOnFocus: true,
          blurOnSelect: true,
          clearText: 'Tøm',
          noOptionsText: 'Ingen treff',
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: '14px',
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            color: 'rgba(0, 0, 0, 0.8)',
            fontSize: '0.875rem',
          },
        },
      },
    },
  },
  nbNO
);

// Font sizes can be configured here (second argument), but not used yet
const theme = responsiveFontSizes(muiTheme);

export default theme;
