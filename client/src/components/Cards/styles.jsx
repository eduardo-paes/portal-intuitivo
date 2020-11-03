const { makeStyles } = require("@material-ui/core");

export const useStyles = makeStyles((theme) => ({
    
  activityButton: {
      width: '17rem'
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
    height: '50px',
    width: '30px'
  },

  backArrow: {
    marginTop: '50%',
    marginLeft: '3rem',
    top: '50%',
    height: '30px',
    width: '30px',
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },

  buttons: {
    margin: '0 0.5rem',
    [theme.breakpoints.down('sm')]: {
      marginTop: '-2rem',
    }
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
    height: '30px',
    width: '30px',
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
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

  material: {
    marginTop: '2rem',
    marginRight: '5rem',
    marginLeft: '5rem',
    [theme.breakpoints.down('sm')]: {
      margin: '0rem',
    }
  },

  question: {
    margin: '1rem 0'
  },

  questionCardDiv: {
    margin: 0,
    padding: 0,
    border: 0,
  },

  questionGrid: {
    marginLeft: '5rem',
    [theme.breakpoints.down('sm')]: {
      marginLeft: '1rem',
    }
  },
  
  root: {
    width: '100%',
  },
  
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    textAlign: 'left',
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(13),
      textAlign: 'center',
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

  swipeableViews: {
    margin: 0,
    padding: 0,
    border: 0
  },
  
  title: {
    fontWeight: '600',
    color: '#606161'
  }
}));
