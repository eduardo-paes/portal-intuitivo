import { green } from "@material-ui/core/colors";
const { makeStyles } = require("@material-ui/core");

export const useStyles = makeStyles((theme) => ({
  
    formControl: {
        margin: '0',
        padding: '0',
        marginLeft: '1rem',
        [theme.breakpoints.down('sm')]: {
          marginLeft: '0.5rem',
        }
    },
  
}));
