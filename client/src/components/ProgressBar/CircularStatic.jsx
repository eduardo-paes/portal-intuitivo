import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { CircularProgress, Typography, Box } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    position: 'relative',
  },
  success: {
    backgroundColor: green[500],
    color: '#fafafa',
    borderRadius: '50%'
  },
}));

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
        <Typography variant="caption" component="div" color="textSecondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

function CircularIntegration() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <CheckIcon className={classes.success} fontSize='large'/>
      </div>
    </div>
  );
}

export default function CircularStatic(props) {
  const { progresso, numTasks } = props;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const abortController = new AbortController();
      setProgress(progresso * (100/numTasks));
    return abortController.abort();
    // eslint-disable-next-line
  }, [progresso, numTasks]);

  const returnCircle = () => {
    
    if (progresso < numTasks) {
      return <CircularProgressWithLabel value={progress} />;
    } else {
      return <CircularIntegration/>
    }
  }

  return ( <> { returnCircle() } </> );
}
