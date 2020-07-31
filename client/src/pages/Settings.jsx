import React, {useState} from "react";
import {MyContainer, MyTextField} from "../styles/styledComponents"
import {DisTable} from "../components"

// Material-UI
import {MenuItem, Grid, Button} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    buttons: {
        marginTop: theme.spacing(2),
        margin: theme.spacing(1)
    }
}));

const initialState = {
    nome: "",
    diaSemana: ''
}

function Settings(props) {
    const classes = useStyles();
    const [disciplina, setDisciplina] = useState(initialState);
    const [data, setData] = useState([]);

    var d = new Date();
    console.log('data', d.getDay());

    // Função para pegar os valores do formulário
    const handleChange = event => {
        const {name, value} = event.target;
        setDisciplina(preValue => ({
            ...preValue,
            [name]: value
        }));
    }

    const saveChange = event => {
      setData(preValue => {
        return [...preValue, disciplina]
      });
      
      setDisciplina(initialState);      
      event.preventDefault();
    }

    return (
        <MyContainer>
            <h1 className="heading-page">Configurações</h1>

            <Grid container={true} spacing={1}>
                <Grid item={true} xs={12}>
                    <h2 className="heading-page">Disciplinas</h2>
                </Grid>

                <Grid item={true} xs={12} sm={6}>
                    <MyTextField
                        id="nomeTextField"
                        variant="outlined"
                        label="Nome"
                        name="nome"
                        type="text"
                        value={disciplina.nome}
                        onChange={handleChange}/>

                    <MyTextField
                        id="diaTextField"
                        variant="outlined"
                        select={true}
                        label="Dia da Semana"
                        name="diaSemana"
                        value={disciplina.diaSemana}
                        onChange={handleChange}>
                          <MenuItem value="1">Segunda-feira</MenuItem>
                          <MenuItem value="2">Terça-feira</MenuItem>
                          <MenuItem value="3">Quarta-feira</MenuItem>
                          <MenuItem value="4">Quinta-feira</MenuItem>
                          <MenuItem value="5">Sexta-feira</MenuItem>
                    </MyTextField>

                    <div className="group-buttons">                    
                        <Button
                            className={classes.buttons}
                            variant="outlined"
                            type="submit"
                            color="secondary">
                            Cancelar
                        </Button>

                        <Button
                            className={classes.buttons}
                            variant="outlined"
                            type="submit"
                            color="primary"
                            onClick={saveChange}>
                            Salvar
                        </Button>
                    </div>
                </Grid>
                <Grid item={true} xs={12} sm={6}>
                  <DisTable data={data}/>
                </Grid>
            </Grid>

        </MyContainer>
    );
};

export default Settings;
