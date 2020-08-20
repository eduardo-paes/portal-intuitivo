import React, { useContext, useState, useEffect } from "react";
import {Link} from 'react-router-dom'
import api from '../../api'

// -- Editor / Context
import { TextEditor } from "../../components";
import { StoreContext } from "../../utils";

// -- Styles
import { MyContainer, MyTextField, MyCard, AddButton, DeleteButton } from "../../assets/styles/styledComponents"
import { Grid, MenuItem, ButtonGroup, Button, Fab, Checkbox } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import "./styles.css"

// -- Local Styles
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
        textAlign: "right",
        alignItems: "right",
        alignSelf: "right",
        alignContent: "right"
    },
    questaoOpcoes: {
        padding: "1rem",
        textAlign: "center",
        alignItems: "center",
    }
}));

// -- Dados iniciais da constante Questão
const initialQuestionState = {
    disciplina: "",
    topico: "",
    enunciado: "",
    resposta: [],
    tipoResposta: "multiplaEscolha",
    dataCriacao: new Date(),
    dataEdicao: new Date(),
    autor: ""
}

// -- Dados iniciais da constante Opções
const initialOptionState = {
    opcao: "", 
    gabarito: false
}

// -- Função Principal
function QuestionUpdate() {
    const classes = useStyles();
    const [disciplina, setDisciplina] = useState([]);                               // Disciplinas do Banco de Dados
    const [questao, setQuestao] = useState(initialQuestionState);                   // Guarda as alterações temporárias do formulário
    const [opcoes, setOpcoes] = useState([initialOptionState]);
    const {token} = useContext(StoreContext);

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
            [name]: value
        }));
    }

    // -- Salvar dados do enunciado da questão
    function handleEnunciado(value) {
        setQuestao(preValue => ({
            ...preValue,
            enunciado: value
        }));
    }

    function handleOpcao(position, value) {
        // Inserção múltipla de opções de resposta
        if (value.includes('</p><p>') && value.length > 10) {
            var options = value.split('</p><p>').map(option => {
                let aux = ''
                option.includes('<p>') && (aux = '<p>')
                option.includes('</p>') && (aux = '</p>')
                return {
                    opcao: '<p>' + option.replace(aux, '') + '</p>',
                    gabarito: false,
                }
            });
            // &nbsp;

            console.log(options)
            setOpcoes(options);
            console.log(opcoes)
        }
        
        // Inserção individual de opções de resposta
        else {
            setOpcoes(opcoes.map((item, index) => {
                if (index === position) {
                    return { ...item, opcao: value };
                } else {
                    return item;
                }
            }));
        }
    
        setQuestao(preValue => ({
            ...preValue,
            resposta: opcoes
        }));
    }

    // -- Salvar dados de gabarito de cada opção
    function handleResposta(value) {
        // Altera valor do gabarito de cada questão
        setQuestao(preValue => ({
            ...preValue,
            tipoResposta: value
        }));
    }

    // -- Salvar dados de gabarito de cada opção
    function handleGabarito(position) {
        // Altera valor do gabarito de cada questão
        setOpcoes(opcoes.map((item, index) => {
            if (index === position) {
                return { ...item, "gabarito": !item.gabarito };
            } else {
                return item;
            }
        })); 

        // Salvando novo status
        setQuestao(preValue => ({
            ...preValue,
            resposta: opcoes
        }));
    }

    // -- Remover opção de resposta
    function deleteThisOption(position) {
        setOpcoes(options => {
            return options.filter((option, index) => {
                return index !== position;
            })
        })
    }

    // -- Adicionar opção de resposta
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

    // -- Salva questão no banco de dados
    async function saveQuestion() {
        setQuestao(preValue => ({
            ...preValue,
            autor: token.userID,
            resposta: opcoes
        }))

        console.log(questao)

        // await api
        //     .inserirQuestao(questao)
        //     .then(res => {
        //         // Limpa os campos
        //         if (res.status === 201) {
                    setQuestao(initialQuestionState);
                    setOpcoes([initialOptionState]);
        //         }
        //     })
    }

    return (
        <MyContainer>
            <section className="cabecalhoQuestao">
                <Grid container={true} className={classes.root} spacing={2}>
                    <Grid item={true} xs={12} sm={9}>
                        <h1 className="heading-page">Criar Questão</h1>
                    </Grid>
                </Grid>

                <Grid container={true} spacing={1}>
                    <Grid item={true} xs={12} sm={6}>
                        <MyTextField
                            id="campoDisciplina"
                            variant="outlined"
                            select={true}
                            label="Disciplina"
                            name="disciplina"
                            autoFocus={true}
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
            </section>
                
            <section className="enunciadoQuestao">
                <h2 className="subtitle-page">Enunciado</h2>
                <MyCard>
                    <TextEditor 
                    optionType={false}
                    text={questao} 
                    setText={handleEnunciado}
                />
                </MyCard>
            </section>

            <section className="respostaQuestao">
                <h2 className="subtitle-page">Respostas</h2>

                <Grid container={true} spacing={1}>
                    <Grid item={true} xs={12} md={8} sm={8}>
                        {
                            questao.tipoResposta === "discursiva" 
                            ? (<p>Questões discursivas possuem como opção de resposta uma caixa de texto.</p>) 
                            : (<p>Defina abaixo as opções de resposta de acordo com o enunciado informado acima.</p>)
                        }
                    </Grid>

                    <Grid className={classes.questaoTipo} item={true} xs={12} md={4} sm={4}>
                        <ButtonGroup size="small" variant="contained" color="primary" aria-label="contained primary button group">
                            <Button onClick={() => handleResposta("multiplaEscolha")}>Múltipla Escolha</Button>
                            <Button onClick={() => handleResposta("discursiva")}>Discursiva</Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>

                <MyCard hidden={questao.tipoResposta === "discursiva" ? true : false}>
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
                                                    onChange={() => handleGabarito(index)}
                                                    inputProps={{ 'aria-label': 'primary checkbox' }}/>
                                            </Grid>
                                            <Grid item={true} xs={10} sm={11}>
                                                <div className="questionEditor">
                                                    <TextEditor 
                                                        optionType={true}
                                                        opcoes={opcoes}
                                                        text={item.opcao} 
                                                        setText={handleOpcao}
                                                        position={index}
                                                        styles={classes.questionEditor}
                                                        />
                                                </div>
                                                {/* <MyTextField
                                                    id="campoOpcao"
                                                    label={`Opção ${index+1}`}
                                                    name="opcao"
                                                    multiline={true}
                                                    autoFocus={true}
                                                    // rowsMax={1}
                                                    value={item.opcao}
                                                    onKeyDown={e => {e.keyCode === 13 && addNewOption()}}
                                                    onChange={e => handleOptionChange(index, "opcao", e.target.value)}/> */}
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
        
            <section className="grupoBotoes">
                <AddButton onClick={saveQuestion}>Salvar</AddButton>
                <Link to="/controle-questoes/create" style={{ textDecoration: 'none' }}>
                    <DeleteButton>Cancelar</DeleteButton>
                </Link>
            </section>
        </MyContainer>
    );
};

export default QuestionUpdate;