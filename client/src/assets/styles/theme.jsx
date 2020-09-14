import {createMuiTheme} from '@material-ui/core/styles';
import {red, cyan} from '@material-ui/core/colors';
import {ptBR} from '@material-ui/core/locale';
import apertura from "./apertura"

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
        },
    },
    typography: {
        color: "#606161",
        fontFamily: apertura,
    },
    button: {
      textDecoration: "none",
      brackgroundColor: "#fff",
      fontFamily: apertura,
    },
    iconButton: {
      textDecoration: "none",
      brackgroundColor: "#fff",
      fontFamily: apertura,
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