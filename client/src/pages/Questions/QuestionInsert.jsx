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
    },
    questaoTipo: {
        textAlign: "center",
        alignItems: "center",
        alignSelf: "center",
        alignContent: "center"
    },
    questaoOpcoes: {
        padding: "1rem",
        textAlign: "center",
        alignItems: "center",
    }
}));


// -- Dados iniciais da constante Atividade
const initialState = {
    disciplina: "",
    topico: "",
    enunciado: [],
    resposta: [],
    tipoResposta: "",
    gabarito: ""
}

// -- Dados iniciais da constante Opções
const initialOptionState = {
    opcao: "", 
    gabarito: false
}

function QuestionInsert() {
    const classes = useStyles();
    const [disciplina, setDisciplina] = useState([]);               // Disciplinas do Banco de Dados
    const [questao, setQuestao] = useState(initialState);           // Guarda as alterações temporárias do formulário
    const [tipoResposta, setTipoResposta] = useState("");           // Guarda as alterações temporárias sobre o tipo de questão
    const [opcoes, setOpcoes] = useState([initialOptionState]);

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

    // -- Salvar dados do formulário inicial
    function handleChange (event) {
        const {name, value} = event.target;
        setQuestao(preValue => ({
            ...preValue,
            [name]: value,
            tipoResposta: tipoResposta
        }));
    }

    // -- Salvar dados das opções de resposta
    function handleOptionChange(position, name, value) {
        var options = value.split('\n').map(option => {
            return {
                opcao: option, 
                gabarito: false
            };
        });

        if (options.length > 1) {
            setOpcoes(options);
        } else {
            setOpcoes(opcoes.map((item, index) => {
                if (index === position) {
                    return { ...item, [name]: value };
                } else {
                    return item;
                }
            }));
        }
    }

    // -- Remover opção de resposta
    function deleteThisOption(position) {
        setOpcoes(options => {
            return options.filter((option, index) => {
                return index !== position;
            })
        })
    }

    // -- Adicionar nova opção de resposta
    function addNewOption() {
        setQuestao(preValue => ({
            ...preValue,
            resposta: opcoes
        }));
        setOpcoes([
            ...opcoes, 
            initialOptionState
        ]);
    }

    return (
        <MyContainer>
            <section id="cabecalhoQuestao">
                <Grid container={true} className={classes.root} spacing={2}>
                    <Grid item={true} xs={12} sm={9}>
                        <h1 className="heading-page">Criar Questão</h1>
                    </Grid>
                </Grid>
            </section>

            <section className="conteudoQuestao">
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
                
                <div className="enunciadoQuestao">
                    <h2 className="subtitle-page">Enunciado</h2>
                    <textarea />
                </div>

                <div className="respostasQuestao">
                    <h2 className="subtitle-page">Respostas</h2>

                    <Grid container={true} spacing={1}>
                        <Grid item={true} xs={12} md={8} sm={8}>
                            {
                                tipoResposta === "discursiva" 
                                ? (<p>Questões discursivas possuem como opção de resposta uma caixa de texto.</p>) 
                                : (<p>Defina abaixo as opções de resposta de acordo com o enunciado informado acima.</p>)
                            }
                        </Grid>

                        <Grid className={classes.questaoTipo} item={true} xs={12} md={4} sm={4}>
                            <ButtonGroup size="small" variant="contained" color="primary" aria-label="contained primary button group">
                                <Button onClick={() => setTipoResposta("multiplaEscolha")}>Múltipla Escolha</Button>
                                <Button onClick={() => setTipoResposta("discursiva")}>Discursiva</Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                </div>

                <MyCard hidden={tipoResposta === "discursiva" ? true : false}>
                        <label id="gabaritoLabel">Gabarito</label>
                        
                        {opcoes.map((item, index) => {
                            let tam = opcoes.length;
                            return (
                                <Grid key={index} className={classes.questaoOpcoes} container={true} spacing={1}>
                                    
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
                                                    multiline={true}
                                                    rowsMax={4}
                                                    value={item.opcao}
                                                    autoFocus={true}
                                                    onKeyDown={e => {e.keyCode === 13 && addNewOption()}}
                                                    onChange={e => handleOptionChange(index, "opcao", e.target.value)}/>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item={true} xs={2} sm={1}>
                                        {index === tam-1 
                                            ?   <Fab className={classes.fabButton} onClick={addNewOption} size="small" color="primary" aria-label="add">
                                                    <AddIcon />
                                                </Fab>
                                            :   <Fab className={classes.fabButton} onClick={() => deleteThisOption (index)} size="small" color="secondary" aria-label="add">
                                                    <DeleteIcon />
                                                </Fab>
                                        } 
                                    </Grid>
                                </Grid>
                            )
                        })}
                    </MyCard>
            </section>
        
            <section className="group-buttons">
                <AddButton onClick={() => console.log(questao)}>Salvar</AddButton>
                <Link to="/controle-questoes/create" style={{ textDecoration: 'none' }}>
                    <DeleteButton>Cancelar</DeleteButton>
                </Link>
            </section>
        </MyContainer>
    );
};

export default QuestionInsert;