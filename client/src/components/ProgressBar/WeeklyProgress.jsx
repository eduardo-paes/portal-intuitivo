import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import { getTheWeek } from '../../utils/auxFunctions';
import { Typography } from '@material-ui/core';
import { GeneralSubtitle } from '../../assets/styles/styledComponents';

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#1a90ff',
  },
}))(LinearProgress);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    alignItems: 'center',
    marginTop: '1rem',
    marginBottom: '-1rem'
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(13),
      justifyContent: 'center',
      textAlign: 'center',
      marginLeft: '0rem',
    }
  }
}));

export default function WeeklyProgress() {
  const classes = useStyles();
  //const week = getTheWeek();
  const week = 17;
  const progresso = ((100*week)/32);
  console.log(progresso + "%")

  return (
    <div className={classes.root}>
      <GeneralSubtitle className={classes.secondaryHeading} id="weeklyProgress">{`Semana ${week} de 32`}</GeneralSubtitle>
      <BorderLinearProgress variant="determinate" value={progresso} />
    </div>
  );
}
