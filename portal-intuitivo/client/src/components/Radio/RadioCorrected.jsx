import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { green } from '@material-ui/core/colors';
import { useStyles } from './styles';
import "./RadioStyles.css";

export default function RadioCorrected(props) {
  const { gabarito, resposta, respostaAluno } = props;
  const classes = useStyles();

  return (
    <>
      <FormControl className={classes.formControl} component="fieldset">
        <RadioGroup 
          aria-label="respostas" 
          value={respostaAluno ? respostaAluno : gabarito._id} 
          name="respostas"
        >
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
                        (row._id === gabarito._id) ? 
                        "gabarito" :
                        'default'
                      } 
                      disabled={true}
                    />
                  }
                  style={{margin: 0}}
                  label={
                    <div 
                      id="mostrarEnunciadoOpcao" 
                      className={row._id === gabarito._id ? 'ck-content gabarito' : 'ck-content'} 
                      color={row._id === gabarito._id ? green[500] : 'default'}
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
