import React, { useState, useEffect } from "react";
import api from '../../api'

// -- Styles
import { MyContainer, MyTextField } from "../../assets/styles/styledComponents"
import { Grid, MenuItem, ButtonGroup, Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import "./styles.css"

const useStyles = makeStyles((theme) => ({
    buttons: {
        marginTop: theme.spacing(2),
        margin: theme.spacing(1)
    },
    root: {
        flexGrow: 1
    },
    group: {
        textAlign: "center"
    }
}));

// -- Dados iniciais da constante Atividade
function initialState() {
    return {
        disciplina: "",
        topico: "",
        enunciado: [],
        resposta: [],
        tipoResposta: "",
        gabarito: ""
    }
}

function QuestionInsert() {
    const classes = useStyles();
    const [disciplina, setDisciplina] = useState([]);           // Disciplinas do Banco de Dados
    const [questao, setQuestao] = useState(initialState);   // Guarda as alterações temporárias do formulário
    const [tipoResposta, setTipoResposta] = useState("");   // Guarda as alterações temporárias do formulário


    // -- Carrega as Disciplinas existentes no banco
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
    function handleChange (event) {
        const {name, value} = event.target;
        setQuestao(preValue => ({
            ...preValue,
            [name]: value,
            tipoResposta: tipoResposta
        }));
        console.log(questao);
    }

    return (
        <MyContainer>
            <header>
                <Grid container={true} className={classes.root} spacing={2}>
                    <Grid item={true} xs={12} sm={9}>
                        <h1 className="heading-page">Criar Questão</h1>
                    </Grid>
                </Grid>
            </header>

            <main>
                <Grid container={true} spacing={1}>
                    <Grid item={true} xs={12} sm={6}>
                        <MyTextField
                            id="campoDisciplina"
                            variant="outlined"
                            select={true}
                            label="Disciplina"
                            name="disciplina"
                            value={questao.disciplina}
                            onChange={handleChange}>
                            {
                                disciplina.map((row, index) => {
                                    return <MenuItem key={index} value={row._id}>{row.nome}</MenuItem>
                                })
                            }
                        </MyTextField>
                    </Grid>

                    <Grid item={true} xs={12} sm={6}>
                        <MyTextField
                            id="campoTopico"
                            label="Tópico"
                            variant="outlined"
                            name="topico"
                            type="text"
                            value={questao.topico}
                            onChange={handleChange}/>
                    </Grid>
                </Grid>
                
                <div className="conteudoQuestao">
                    <div className="enunciadoQuestao">
                        <h2 className="heading-page">Enunciado</h2>
                        <textarea />
                    </div>

                    <div className="respostasQuestao">
                        <h2 className="heading-page">Respostas</h2>
                        <div className="questionType">
                            <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                                <Button onClick={() => setTipoResposta("multiplaEscolha")} name="tipoResposta" value={questao.tipoResposta}>Múltipla Escolha</Button>
                                <Button onClick={() => setTipoResposta("discursiva")} name="tipoResposta" value={questao.tipoResposta}>Discursiva</Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </div>
                
            </main>
        </MyContainer>
    );
};

export default QuestionInsert;