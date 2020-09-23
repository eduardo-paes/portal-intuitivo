import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';

function CircularProgressWithLabel(props) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="static" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and static variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  success: {
    backgroundColor: green[500],
    color: '#fafafa',
    '&:hover': {
      backgroundColor: green[700],
    },
  },
}));

function CircularIntegration() {
  const classes = useStyles();
  

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Fab size="small" component='div' className={classes.success}>
          <CheckIcon />
        </Fab>
      </div>
    </div>
  );
}

export default function CircularStatic(props) {
  const classes = useStyles();
  const [progress, setProgress] = React.useState(0);
  const { progresso } = props;

  React.useEffect(() => {
    setProgress(progresso*25);
  }, [progresso]);

  if ( progresso < 4 ) {
    return <CircularProgressWithLabel value={progress} />;
  } else {
    return <CircularIntegration/>
  }
}
