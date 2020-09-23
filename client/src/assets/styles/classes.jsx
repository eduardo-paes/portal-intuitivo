const { makeStyles } = require("@material-ui/core");

export const useStyles = makeStyles((theme) => ({
    
  activityButton: {
      width: '17rem'
  },
  
  answer: {
    marginLeft: '-1.5rem'
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
  
  title: {
    fontWeight: '600'
  }

}));
