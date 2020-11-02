const { makeStyles } = require("@material-ui/core");

export const useStyles = makeStyles((theme) => ({
    
  accordionDetails: {
    display: 'flex',
    justifyContent: 'center',
    margin: 0,
    padding: 0,
  },

  accordionSummary: {
    margin: '0.625rem 0'
  },

  activityButton: {
    // minWidth: '17rem'
  },
  
  answer: {
    marginLeft: '-1.5rem'
  },

  answerField: {
    width: '100%',
    marginTop: '1rem',
    marginLeft: '1rem'
  },
  
  appBar: {
    position: 'relative',
  },

  arrow: { 
    height: '3.125rem',
    width: '1.875rem'
  },

  backArrow: {
    marginTop: '50%',
    marginLeft: '3rem',
    top: '50%',
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },

  buttons: {
    marginLeft: '0.5rem',
    marginRight: '0.5rem',
    marginUp: '1rem',
    marginBottom: '2rem'
  },
  
  checkbox: {
      display: 'none'
  },
  
  finalizedButton: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center'
  },

  forwardArrow: {
    marginTop: '50%',
    top: '50%',
    height: '1.875rem',
    width: '1.875rem',
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  
  heading: {
    alignItems: 'center',
    color: '#606161',
    display: 'flex',
    // flexBasis: '33.33%',
    flexShrink: 0,
    fontSize: theme.typography.pxToRem(15),
    marginLeft: '1rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(14)
    }
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

  questionText: {
    marginLeft: '1rem',
    marginRight: '2rem',
  },
  
  root: {
    width: '100%',
  },
  
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(16),
    color: theme.palette.text.secondary,
    textAlign: 'left',
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(14),
      textAlign: 'center',
      marginTop: '-1rem',
      // marginBottom: '0.4rem'
    }
  },

  subtitleLibrary: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    textAlign: 'right',
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(13),
      textAlign: 'center',
    }
  },
  
  title: {
    fontWeight: '600'
  }

}));
