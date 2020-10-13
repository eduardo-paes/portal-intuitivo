import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
  root: {
    width: 300,
  },
});


export default function DiscreteSlider(props) {

    const classes = useStyles();
    const { valor, setValor, max } = props;
    const [ preValor, setPreValor ] = React.useState(valor);
    
    // function valuetext(value) {
      
    //   setPreValor(valor);  
    //   setValor(value);
      
    //   return(value);

    // }
  return (
    <div className={classes.root}>
      <Slider
        defaultValue={valor}
        // getAriaValueText={valuetext}
        aria-labelledby="discrete-slider-small-steps"
        step={1}
        marks
        min={1}
        max={max}
        valueLabelDisplay="auto"
      />
    </div>
  );
}