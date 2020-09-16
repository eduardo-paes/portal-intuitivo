const { makeStyles } = require("@material-ui/core");

export const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
      marginLeft: '1rem',
      alignItems: 'center',
      display: 'flex',
      [theme.breakpoints.down('sm')]: {
        fontSize: theme.typography.pxToRem(14)
      }
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
      marginLeft: '50%',
      alignItems: 'center',
      justifyContent: 'flex-end',
      textAlign: 'flex-end',
      display: 'flex',
      [theme.breakpoints.down('sm')]: {
        fontSize: theme.typography.pxToRem(13),
        marginLeft: '20%',
      }
    },
    appBar: {
      position: 'relative',
    },
    activityButton: {
        width: '17rem'
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    finalizedButton: {
      display: 'flex',
      alignContent: 'center',
      justifyContent: 'center'
    },
    material: {
      marginTop: '2rem',
      marginRight: '5rem',
      marginLeft: '5rem',
      [theme.breakpoints.down('sm')]: {
        margin: 0,
      }

    },
    question: {
      marginTop: '1rem',
      marginLeft: '5rem',
      marginRight: '5rem',
      [theme.breakpoints.down('sm')]: {
        marginLeft: '1rem',
        marginRight: '0.5rem'
      }
    },
    checkbox: {
        display: 'none'
    }
}));
