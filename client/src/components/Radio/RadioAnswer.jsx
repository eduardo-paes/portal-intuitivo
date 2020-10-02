import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { MyContainer } from '../../assets/styles/styledComponents';

export default function RadioAnswer(props) {
  const { answered, color, idQuestion, gabarito, resposta, setRespostaQuestao, value, setValue } = props;

  const handleChange = (event) => {
    const { value } = event.target;
    setValue(value);
    setRespostaQuestao((prevValue) => ({
      ...prevValue,
      [idQuestion]: value
    }));
  };

  return (
    <MyContainer>
      <FormControl component="fieldset">
        <RadioGroup aria-label="respostas" value={value} name="respostas" onChange={handleChange}>
          {
              resposta.map((row, index) => {
                  return (
                      <FormControlLabel 
                          key={index} 
                          value={row._id} 
                          control={<Radio id={row._id} disabled={answered && row._id === gabarito ? false : answered} color={color}/>}
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
    </MyContainer>
  );
}
