import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { Button } from '@material-ui/core';
import { MyContainer } from '../../assets/styles/styledComponents';
import { get } from 'js-cookie';

export default function RadioAnswer(props) {
  const { answered, color, gabarito, resposta, value, setValue } = props;
  console.log(gabarito);

  const handleChange = (event) => {
    setValue(event.target.value);
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
