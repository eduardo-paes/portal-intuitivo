import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import TextEditor from '../Editor/Editor';

export default function RadioAnswer(props) {
  const { resposta } = props;
  const [value, setValue] = React.useState(0);
  for (let i = 0; i < resposta.lenght; ++i) {
      if (resposta.gabarito === true) { 
        break;
      }
  }

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <FormControl component="fieldset">
      <RadioGroup aria-label="respostas" value={value} name="respostas" onChange={handleChange}>
        {
            resposta.map((row, index) => {
                return (
                    <FormControlLabel 
                        key={index} 
                        value={row._id} 
                        control={<Radio color="primary"/>} 
                        label={
                            <TextEditor 
                                id="mostrarResposta" 
                                text={row.opcao} 
                                readOnly={true}
                            />
                        }
                    />
                )
            })
        }
      </RadioGroup>
    </FormControl>
  );
}
