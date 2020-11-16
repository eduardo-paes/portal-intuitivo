import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { green } from '@material-ui/core/colors';
import { useStyles } from './styles';
import "./RadioStyles.css";

export default function RadioAnswer(props) {
  const { answered, gabarito, resposta, respostaQuestao, setRespostaQuestao, mobile, respostaMobile } = props;
  const classes = useStyles();

  const handleChange = (event) => {
    const {value} = event.target;
    let valor;
    if (value === gabarito) valor = 100;
    else valor = 0;

    setRespostaQuestao(prevValue => ({
      ...prevValue,
      resposta: value,
      nota: valor,
      corrigido: true
    }));
  };

  return (
    <>
      <FormControl className={classes.formControl} component="fieldset">
        <RadioGroup 
          aria-label="respostas" 
          value={
              respostaQuestao.resposta && !mobile ?
              respostaQuestao.resposta : 
              respostaQuestao.resposta && mobile ?
              respostaMobile : null
          } 
          name="respostas" 
          onChange={handleChange}>
          {
              resposta.map((row, index) => {
                  return (
                      <FormControlLabel 
                          key={index} 
                          value={row._id} 
                          control={
                            <Radio 
                              id={row._id} 
                              color="primary"
                              className={
                                (answered && row._id === gabarito) ? 
                                "gabarito" : 
                                (answered && (row._id === respostaQuestao.resposta || row._id === respostaMobile)) ? 
                                "respostaErrada" : 'default'
                              } 
                              disabled={answered}
                            />
                          }
                          style={{margin: 0}}
                          label={
                            <div 
                              id="mostrarEnunciadoOpcao" 
                              className={answered && row._id === gabarito ? 'ck-content gabarito' : (answered && (row._id === respostaQuestao.resposta || row._id === respostaMobile)) ? 'ck-content respostaErrada' : 'ck-content'} 
                              color={answered && row._id === gabarito ? green[500] : 'default'}
                              dangerouslySetInnerHTML={{ __html: row.opcao}} 
                            /> 
                          }
                      />
                  )
              })
          }
        </RadioGroup>
      </FormControl>
    </>
  );
}
