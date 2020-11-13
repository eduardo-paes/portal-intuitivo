import { createMuiTheme } from '@material-ui/core/styles';
import { red, cyan } from '@material-ui/core/colors';
import { ptBR } from '@material-ui/core/locale';
import { aperturaRegular } from "./apertura"

const theme = createMuiTheme({
    palette: {
      primary: {
        light: cyan[300],
        main: cyan[500],
        dark: cyan[700],
        contrastText: '#fff',
      },
      secondary: {
        light: red[300],
        main: red[500],
        dark: red[700],
        contrastText: '#fff',
      },
    },
    typography: {
      color: "#606161",
      fontFamily: 'Apertura, sans-serif',
    },
    button: {
      textDecoration: "none",
      brackgroundColor: "#fff",
      fontFamily: 'Apertura',
    },
    iconButton: {
      textDecoration: "none",
      brackgroundColor: "#fff",
      fontFamily: 'Apertura',
    },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          '@font-face': [aperturaRegular],
        },
      },
    },
}, ptBR);

export default theme;