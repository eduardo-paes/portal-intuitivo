import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import apis from '../../api';

const useStyles = makeStyles({
  root: {
    marginTop: '1rem',
    height: '2rem',
    width: 300,
  },
});

const marks = [
  {
    value: 0,
    label: '0%',
  },
  {
    value: 0.25,
    label: '25%',
  },
  {
    value: 0.5,
    label: '50%',
  },
  {
    value: 0.75,
    label: '75%',
  },
  {
    value: 1,
    label: '100%',
  },
];

export default function DiscreteSlider(props) {
  const { defaultValue, respostaQuestaoID, setProgresso, progresso } = props;
  const classes = useStyles();
  console.log(progresso);

  async function valueLabelFormat(value) {
    const index = marks.findIndex((mark) => mark.value === value);
    const response = await apis.encRespostaQuestaoPorID(respostaQuestaoID);
    let novaResposta = response.data.data;
    novaResposta.nota = marks[index].value;
    novaResposta.corrigido = true;
    await apis.atualizarRespostaQuestao(respostaQuestaoID, novaResposta);
  }
  
  return (
    <div className={classes.root}>
      <Slider
        defaultValue={defaultValue}
        aria-labelledby="discrete-slider-restrict"
        valueLabelFormat={valueLabelFormat}
        step={0.25}
        valueLabelDisplay="off"
        marks={marks}
        min={0}
        max={1}
      />
    </div>
  );
}
