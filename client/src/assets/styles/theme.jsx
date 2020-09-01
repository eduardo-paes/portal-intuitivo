import {createMuiTheme} from '@material-ui/core/styles';
import {red, cyan} from '@material-ui/core/colors';
import {ptBR} from '@material-ui/core/locale';

import Apertura from '../fonts/apertura_regular.ttf';

const apertura = {
  fontFamily: 'apertura',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
    local('Apertura'),
    local('Apertura-Regular'),
    url(${Apertura}) format('ttf')
  `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

const theme = createMuiTheme({
    palette: {
        primary: {
            light: cyan[300],
            main: cyan[500],
            dark: cyan[700],
            contrastText: "#fff"
        },
        secondary: {
            light: red[300],
            main: red[500],
            dark: red[700],
            contrastText: "#fff"
        }
    },
    typography: {
        color: "#606161",
        fontFamily: apertura,
    },
    button: {
      textDecoration: "none",
      brackgroundColor: "#fff"
    },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          '@font-face': [apertura],
        },
      },
    },
}, ptBR);

export default theme;