import React, {useContext, useState, useEffect} from "react";
import {StoreContext} from "../utils"
import {TextEditor} from "../components"
import {Grid, MenuItem, Button} from '@material-ui/core';
import {MyContainer, MyTextField} from "../assets/styles/styledComponents"
import {makeStyles} from '@material-ui/core/styles';
import api from '../api'

function initialState() {
    return {
        tipoExercicio: "",
        disciplina: "",
        topico: "",
        conteudo: "",
        disponivel: false,
        dataCriacao: new Date(),
        dataModificacao: new Date(),
        autor: {}
    }
}

const useStyles = makeStyles((theme) => ({
    buttons: {
        marginTop: theme.spacing(2),
        margin: theme.spacing(1)
    },
    group: {
        textAlign: "center"
    }
}));

function Exercises(props) {
    // -- Define principais constantes
    const classes = useStyles();
    const {token} = useContext(StoreContext);
    const [atividade, setAtividade] = useState(initialState); // Guarda as alterações temporárias do formulário
    const [disciplina, setDisciplina] = useState([]); // Disciplinas do Banco de Dados
    const autor = {
        id: token.userID,
        nome: token.userName
    }

    useEffect(() => {
        const abortController = new AbortController();
        async function fetchDisciplinaAPI() {
            const response = await api.listarDisciplinas();
            const value = response.data.data;
            setDisciplina(value);
        }
        fetchDisciplinaAPI()
        return abortController.abort();
    }, [disciplina]);

    // -- Definição das Funções
    const handleChange = (event) => {
        const {name, value} = event.target;
        setAtividade(preValue => ({
            ...preValue,
            [name]: value
        }));
    }

    const saveChange = (event) => {
        setAtividade(preValue => ({
            ...preValue,
            dataModificacao: new Date(),
            autor: autor
        }));
        console.log(atividade);
    }

    return (
        <MyContainer>
            <h1 className="heading-page">Atividades</h1>

            <Grid container={true} spacing={1}>
                <Grid item={true} xs={12} sm={6}>
                    <MyTextField
                        id="campoTipoAtiv"
                        variant="outlined"
                        select={true}
                        label="Tipo de Atividade"
                        name="tipoExercicio"
                        value={atividade.tipoExercicio}
                        onChange={handleChange}>
                        <MenuItem value="fixacao">Fixação</MenuItem>
                        <MenuItem value="revisao">Retomada</MenuItem>
                        <MenuItem value="aprofundamento">Aprofundamento</MenuItem>
                        <MenuItem value="revisao">Avaliação Diagnóstica</MenuItem>
                    </MyTextField>
                </Grid>
                <Grid item={true} xs={12} sm={6}>
                    <MyTextField
                        id="campoDiscAtiv"
                        variant="outlined"
                        select={true}
                        label="Disciplina"
                        name="disciplina"
                        value={atividade.disciplina}
                        onChange={handleChange}>
                        {
                            disciplina.map((row, index) => {
                                return <MenuItem key={index} value={row.nome}>{row.nome}</MenuItem>
                            })
                        }
                    </MyTextField>
                </Grid>
                <Grid item={true} xs={12}>
                    <MyTextField
                        id="outlined-basic"
                        label="Tópico"
                        variant="outlined"
                        name="topico"
                        type="text"
                        value={disciplina.topico}
                        onChange={handleChange}/>
                </Grid>
            </Grid>

            <TextEditor
                atividade={atividade}
                setAtividade={setAtividade}
            />

            <div className={classes.group}>
                <Button
                    className={classes.buttons}
                    variant="outlined"
                    type="submit"
                    color="secondary"
                    onClick={() => setAtividade(initialState)}>
                    Limpar
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

        </MyContainer>
    );
};

export default Exercises;