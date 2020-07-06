import { createMuiTheme } from '@material-ui/core/styles';
import {red, cyan} from '@material-ui/core/colors';
import { ptBR } from '@material-ui/core/locale';

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
}, ptBR);

export default theme;