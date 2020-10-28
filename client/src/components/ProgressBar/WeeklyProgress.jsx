import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
//import { getTheWeek } from '../../utils/auxFunctions';
import { GeneralSubtitle } from '../../assets/styles/styledComponents';
import { Grid } from '@material-ui/core';

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
    marginTop: '-1rem',
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 10,
    backgroundColor: '#94c93d',
  },
}))(LinearProgress);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    alignItems: 'center',
    marginTop: '0rem',
    marginBottom: '0rem'
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(20),
    color: theme.palette.text.secondary,
    justifyContent: 'center',
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(13),
      textAlign: 'center',
    }
  }
}));

export default function WeeklyProgress(props) {
  const classes = useStyles();
  const { max, progresso, titulo } = props;

  return (
    <Grid item className={classes.root} justify='center'>
      <GeneralSubtitle className={classes.secondaryHeading} id="weeklyProgress">{titulo}</GeneralSubtitle>
      <BorderLinearProgress variant="determinate" value={max > 0 ? ((100*progresso)/max) : 100} />
    </Grid>
  );
}
