import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Slider, Input } from '@material-ui/core';
import GradeIcon from '@material-ui/icons/Grade';
import "./RadioStyles.css";
import { GeneralText } from '../../assets/styles/styledComponents';

const useStyles = makeStyles((theme) => ({
  colorAction: {
    marginTop: '1.5rem',
    maginLeft: '1rem',
    color: '#fdc504',
  },
  slider: {
    [theme.breakpoints.down('sm')]: {
      width: "85%",
    }
  },
  sliderGrid: {
    textAlign: 'center',
  },
  grade: {
    textAlign: 'center',
    marginTop: '1.5rem'
  },
  container: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center'
  }
}));

export default function InputSlider(props) {
    const {title, value, setValue} = props;

    const classes = useStyles();
    const marks = [
      {
        value: 0,
        label: '',
      },
      {
        value: 25,
        label: '',
      },
      {
        value: 50,
        label: '',
      },
      {
        value: 75,
        label: '',
      },
      {
        value: 100,
        label: '',
      },
    ];

    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleInputChange = (event) => {
        setValue(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleBlur = () => {
      if (value < 0) {
      setValue(0);
      } else if (value > 100) {
      setValue(100);
      }
    };

    return (
      <Grid container={true} spacing={1} alignItems="center" className={classes.container}>

        <Grid item={true} xs={1} className={classes.sliderGrid}>
          <GradeIcon className={classes.colorAction} />
        </Grid>

        <Grid item={true} xs={10} className={classes.sliderGrid}>
          <GeneralText id="input-slider" gutterBottom>{title}</GeneralText>
          <Slider
            value={typeof value === 'number' ? value : 0}
            className={classes.slider}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            marks={marks}
          />
        </Grid>

        <Grid item={true} className={classes.grade} xs={1}>
            <Input
              className={classes.input}
              value={value}
              margin="none"
              disableUnderline={true}
              onChange={handleInputChange}
              onBlur={handleBlur}
              inputProps={{
                step: 10,
                min: 0,
                max: 100,
                type: 'number',
                'aria-labelledby': 'input-slider',
                style: { textAlign: 'center' }
              }}
            />
        </Grid>

      </Grid>
    );
}