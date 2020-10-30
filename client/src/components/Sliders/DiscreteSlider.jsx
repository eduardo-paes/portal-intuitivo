import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import apis from '../../api';
import { useState } from 'react';
import { Grid, Input } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '1rem',
    marginBottom: '2rem',
    width: '100%',
  },
  slider: {
    [theme.breakpoints.down('sm')]: {
      width: "95%"
    }
  },
  grade: {
    textAlign: 'right',
    marginTop: '-1.5rem'
  },
  container: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center'
  }
}));

const marks = [
  {
    value: 0,
    label: '0%',
  },
  {
    value: 100,
    label: '100%',
  }
];

export default function DiscreteSlider(props) {
  const { defaultValue, respostaQuestaoID } = props;
  const [ nota, setNota ] = useState(defaultValue);
  const classes = useStyles();

  const handleChange = async (event, newValue) => {

    console.log(newValue);

    if (newValue === nota) return null;
    
    setNota(newValue);
    const response = await apis.encRespostaQuestaoPorID(respostaQuestaoID);
    let novaResposta = response.data.data;
    novaResposta.nota = newValue;
    novaResposta.corrigido = true;
    await apis.atualizarRespostaQuestao(respostaQuestaoID, novaResposta);
  }

  function handleInputChange (event) {
    handleChange(event, event.target.value === '' ? '' : Number(event.target.value))
  }

  const handleBlur = () => {
    if (nota < 0) {
    setNota(0);
    } else if (nota > 100) {
      setNota(100);
    }
  };
  
  return (
    <Grid container spacing={2} alignItems="center" className={classes.container}>
      <Grid item xs={10}>
        <Slider
          defaultValue={nota}
          className={classes.slider}
          value={typeof nota === 'number' ? nota : 0}
          aria-labelledby="input-slider"
          step={1}
          valueLabelDisplay="off"
          marks={marks}
          min={0}
          max={100}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={2} className={classes.grade}>
        <Input
          value={nota}
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
          }} 
        />
      </Grid>
    </Grid>
  );
}
