import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: '0',
    padding: '0',
    marginLeft: '1rem',
    [theme.breakpoints.down('sm')]: {
      marginLeft: '0.5rem',
    }
  }
}))

export default function RadioAnswer(props) {
  const { answered, color, gabarito, resposta, respostaQuestao, setRespostaQuestao, mobile, respostaMobile } = props;
  const classes = useStyles();

  const handleChange = (event) => {
    const {value} = event.target;

    setRespostaQuestao(prevValue => ({
      ...prevValue,
      resposta: value
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
                          control={<Radio id={row._id} disabled={answered && row._id === gabarito ? false : answered} color={color}/>}
                          style={{margin: 0}}
                          label={
                            <div 
                              id="mostrarEnunciadoOpcao" 
                              className='ck-content' 
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
