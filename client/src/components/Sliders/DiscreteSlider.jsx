import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import apis from '../../api';
import { useState } from 'react';
import { Grid, Input } from '@material-ui/core';
import { useEffect } from 'react';

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
  const { value, respostaQuestaoID, setWasLoaded, respostaAluno, setRespostaAluno, indice, index } = props;

  const classes = useStyles();
  
  const handleChange = async (event, newValue) => {
    
    
    if (newValue === value) return null;
    
    const response = await apis.encRespostaQuestaoPorID(respostaQuestaoID);
    let novaResposta = response.data.data;
    novaResposta.nota = newValue;
    novaResposta.corrigido = true;
    let novaRespostaAluno = respostaAluno;
    novaRespostaAluno[indice].respostaQuestaoIDs[index].nota = value;
    novaRespostaAluno[indice].respostaQuestaoIDs[index].corrigido = true;
    setRespostaAluno(novaRespostaAluno);
    setWasLoaded(false);
    await apis.atualizarRespostaQuestao(respostaQuestaoID, novaResposta);

  }
  
  function handleInputChange (event) {
    handleChange(event, event.target.value === '' ? '' : Number(event.target.value))
  }
  
  const handleBlur = () => {
    if (value < 0) {
      value = (0);
    } else if (value > 100) {
      value = (100);
    }
  };
  
  return (
    <Grid container spacing={2} alignItems="center" className={classes.container}>
      <Grid item xs={10}>
        {console.log(value)}
        <Slider
          className={classes.slider}
          value={value}
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
          }} 
        />
      </Grid>
    </Grid>
  );
}
