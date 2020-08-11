import React, { useState, useEffect } from "react";
import {Link} from 'react-router-dom'
import api from '../../api'

// -- Styles
import { MyContainer, MyTextField, MyCard, AddButton, DeleteButton } from "../../assets/styles/styledComponents"
import { Grid, MenuItem, ButtonGroup, Button, Fab, Checkbox } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
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
    },
    fabButton: {
        marginTop: "0.4rem"
    },
    checkBox: {
        marginTop: "0.4rem"
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
    const [opcoes, setOpcoes] = useState([{opcao: "", gabarito: false}]);

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
    }

    function handleOptionChange(position, name, value) {
        setOpcoes(opcoes.map((item, index) => {
            if (index === position) {
                return { ...item, [name]: value };
            } else {
                return item;
            }
        }));
        console.log(value);
    }

    function deleteThisOption(position) {
        setOpcoes(options => {
            return options.filter((option, index) => {
                return index !== position;
            })
        })
    }

    function addNewOption(event) {
        setQuestao(preValue => ({
            ...preValue,
            resposta: opcoes
        }));
        setOpcoes([
            ...opcoes,
            { opcao: '' }
        ]);
        event.preventDefault();
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
                        <h2 className="subtitle-page">Enunciado</h2>
                        <textarea />
                    </div>

                    <div className="respostasQuestao">
                        <h2 className="subtitle-page">Respostas</h2>

                        <Grid container={true} spacing={1}>
                            <Grid item={true} xs={12} sm={9}>
                                {
                                    tipoResposta === "discursiva" 
                                    ? (<p>Questões discursivas possuem como opção de resposta uma caixa de texto.</p>) 
                                    : (<p>Defina abaixo as opções de resposta de acordo com o enunciado informado acima.</p>)
                                }
                            </Grid>

                            <Grid item={true} xs={12} sm={3}>
                                <div className="questaoTipo">
                                    <ButtonGroup size="small" variant="contained" color="primary" aria-label="contained primary button group">
                                        <Button onClick={() => setTipoResposta("multiplaEscolha")}>Múltipla Escolha</Button>
                                        <Button onClick={() => setTipoResposta("discursiva")}>Discursiva</Button>
                                    </ButtonGroup>
                                </div>
                            </Grid>
                        </Grid>
                    </div>

                    <MyCard hidden={tipoResposta === "discursiva" ? true : false}>
                        <label id="gabarito">Gabarito</label>
                        {opcoes.map((item, index) => {
                            let tam = opcoes.length;
                            return (
                                <div key={index} className="questaoOpcoes">
                                        <Grid container={true} spacing={1}>
                                            <Grid item={true} xs={10} sm={11}>
                                                
                                                <Grid container={true} spacing={1}>
                                                    <Grid item={true} xs={2} sm={1}>
                                                        <Checkbox
                                                            checked={opcoes.gabarito}
                                                            className={classes.checkBox}
                                                            onChange={e => handleOptionChange(index, "gabarito", e.target.value)}
                                                            inputProps={{ 'aria-label': 'primary checkbox' }}/>
                                                    </Grid>
                                                    <Grid item={true} xs={10} sm={11}>
                                                        <MyTextField
                                                            id="campoOpcao"
                                                            label={`Opção ${index+1}`}
                                                            name="opcao"
                                                            type="text"
                                                            value={item.opcao}
                                                            autoFocus={true}
                                                            onKeyDown={e => {e.keyCode === 13 && addNewOption(e)}}
                                                            onChange={e => handleOptionChange(index, "opcao", e.target.value)}/>
                                                    </Grid>
                                                </Grid>

                                            </Grid>

                                            <Grid item={true} xs={2} sm={1}>
                                                {index === tam-1 
                                                    ?
                                                        <Fab className={classes.fabButton} onClick={addNewOption} size="small" color="primary" aria-label="add">
                                                            <AddIcon />
                                                        </Fab>
                                                    :
                                                        <Fab className={classes.fabButton} onClick={() => deleteThisOption (index)} size="small" color="secondary" aria-label="add">
                                                            <DeleteIcon />
                                                        </Fab>
                                                } 
                                            </Grid>
                                        </Grid>
                                </div>
                            )
                        })}
                    </MyCard>
                </div>
            </main>
        
            <footer>
                <div className="group-buttons">
                    <AddButton onClick={() => console.log(questao)}>Salvar</AddButton>
                    <Link to="/controle-questoes/create" style={{ textDecoration: 'none' }}>
                        <DeleteButton>Cancelar</DeleteButton>
                    </Link>
                </div>
            </footer>
        </MyContainer>
    );
};

export default QuestionInsert;