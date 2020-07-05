import { createMuiTheme } from '@material-ui/core/styles';
import cyan from '@material-ui/core/colors/cyan'

const theme = createMuiTheme({
  palette: {
    primary: {
        light: cyan[300],
        main: cyan[500],
        dark: cyan[700],
        contrastText: "#fff"
    }
  },
});

export default theme;