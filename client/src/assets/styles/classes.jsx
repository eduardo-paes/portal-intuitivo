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
      alignItems: 'center',
      marginLeft: '1rem',
      display: 'flex',
      [theme.breakpoints.down('sm')]: {
        fontSize: theme.typography.pxToRem(13),
        justifyContent: 'center',
        textAlign: 'center',
        marginLeft: '0rem',
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
    answer: {
      alignItems: 'left',
      display: 'flex',
      justifyContent: 'left',
      marginLeft: '-2rem',
      marginRight: '-2rem',
      width: '100%'
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
    questionText: {
      marginLeft: '1rem',
      marginRight: '1rem',
    },
    checkbox: {
        display: 'none'
    }
}));
