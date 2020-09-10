import React, {useState, useEffect} from "react";
import {Link} from 'react-router-dom'

// -- Editor / Chips / api
import { TextEditor } from "../";
import ChipsArray from './Utils/Chips'
import api from '../../api'

// -- Styles / Imports
import { MyContainer, MyTextField, MyCard, AddButton, DeleteButton } from "../../assets/styles/styledComponents"
import { Grid, MenuItem, ButtonGroup, Button, Fab, Checkbox } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import "./Styles/stylesQuestionForm.css"

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
    questaoOpcoes: {
        padding: "1rem",
        textAlign: "center",
        alignItems: "center",
    },
    errorMessage: {
        fontSize: "0.75rem",
        paddingLeft: "1rem",
        color: "#f44336"
    },
    errorAlarm: {
        border:"1px solid #f44336"
    }
}));

export default function QuestionForm (props) {
    const classes = useStyles();
    const {title, questao, setQuestao, opcoes, setOpcoes, saveQuestion, initialOptionState} = props;
    const [listaDisciplinas, setListaDisciplinas] = useState([]);
    const [selectedTag, setSelectedTag] = useState([]);
    const [topico, setTopico] = useState([]);
    const [count, setCount] = useState(1);

    // -- Carrega as Disciplinas existentes no banco
    useEffect(() => {
        const abortController = new AbortController();
        async function fetchDisciplinaAPI() {
            const response = await api.listarDisciplinas();
            const value = response.data.data;
            setListaDisciplinas(value);
        }
        fetchDisciplinaAPI()
        return abortController.abort();
    }, []);

    // -- Salva alterações de 'opcoes' em 'questao'
    useEffect(() => {
        setQuestao(preValue => ({
            ...preValue,
            resposta: opcoes
        }));
        // eslint-disable-next-line
    }, [opcoes])

    // -- Confirma mudanças realizadas em questao
    useEffect(() => {
        setQuestao(questao);
        if (count) {
            if (questao.tags.length > 0 && selectedTag.length === 0) {
                setSelectedTag(questao.tags);
                setCount(count-1)
            }
        }
        // eslint-disable-next-line
    }, [questao]);

    // -- Confirma mudanças realizadas em questao
    useEffect(() => {
        handleTag();
        // eslint-disable-next-line
    }, [selectedTag]);

    // -- Carrega os Tópicos, por Disciplina, existentes no banco
    useEffect(() => {
        const abortController = new AbortController();
        if (questao.disciplina.id !== '') {
            async function fetchTopicoAPI() {
                const response = await api.listarConteudoPorDisciplina(questao.disciplina.id);
                setTopico(response.data.data);
            }
            fetchTopicoAPI()
        }
        return abortController.abort();
        // eslint-disable-next-line
    }, [questao.disciplina.id]);

    // -- Salvar dados do formulário inicial
    function handleChange (nameField, ID, nome) {  
        setQuestao(preValue => ({
            ...preValue,
            [nameField]: {
                id: ID,
                nome: nome
            }
        }));
    }

    // -- Salvar dados de tags
    function handleTag () {
        setQuestao(preValue => ({
            ...preValue,
            tags: selectedTag
        }));
    }

    // -- Salvar dados do enunciado da questão
    function handleEnunciado(value) {
        setQuestao(preValue => ({
            ...preValue,
            enunciado: value
        }));
    }

    // -- Salvar dados do enunciado da questão
    function handlePadraoResposta(value) {
        setQuestao(preValue => ({
            ...preValue,
            padraoResposta: value
        }));
    }

    // -- Salvar dados das opções da questão
    function handleOpcao(position, value) {
        // Verifica se valor contém parágrafo e espaços vazios
        let blankSpace = value.includes('<p>&nbsp;</p>');
        let paragraphs = value.includes('</p><p>');
        
        // Se sim, Inserção múltipla de opções de resposta
        if (!blankSpace && paragraphs) {
            // Separa o texto entre parágrafos
            var options = value.split('</p><p>').map(option => {
                // Correções do split adicionando tag <p> faltante
                if (option.includes('<p>')) {
                    option = option + '</p>';
                } else if (option.includes('</p>')) {
                    option = '<p>' + option;
                } else {
                    option = '<p>' + option + '</p>';
                }

                // Retorna um objeto opção contstarto o campo de 'opcao' preenchido
                return {
                    opcao: option,
                    gabarito: false,
                }
            });

            // Verifica se o array de opções já contém algum valor
            var optionsAux = opcoes.filter(item => {
                return item.opcao !== "";
            })

            // Caso o array opcoes já contém algum valor, arrayAux recebe esses valores, do contrário recebe um array vazio
            var arrayAux = optionsAux.length > 0 ? optionsAux : [];

            // Caso não, o array auxiliar será um vetor vazio
            if (arrayAux === []) {
                setOpcoes(options);
            }
            // De outro modo, serão inseridos novos valores
            else {
                options.forEach(item => {arrayAux.push(item)});
                setOpcoes(arrayAux);
            }
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
    }

    // -- Remover opção de resposta
    function deleteThisOption(event, position) {
        setOpcoes(opcoes.filter((option, index) => {
            return index !== position;
        }));
    }

    // -- Adicionar opção de resposta
    function addNewOption() {
        setOpcoes([
            ...opcoes, 
            initialOptionState
        ]);
    }

    return (
        <MyContainer>
            <section className="cabecalhoQuestao">
                <Grid container={true} className={classes.root} spacing={2}>
                    <Grid item={true} xs={12}>
                        <h1 className="heading-page">{title}</h1>
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
                            value={questao.disciplina.nome}
                            error={questao.erros.disciplina ? true : false}>
                            {
                                listaDisciplinas.map((row, index) => {
                                    return <MenuItem key={index} value={row.nome} onClick={() => handleChange("disciplina", row._id, row.nome)}>{row.nome}</MenuItem>
                                })
                            }
                        </MyTextField>
                        {questao.erros.disciplina && <p className={classes.errorMessage}>{questao.erros.disciplina}</p>}
                    </Grid>

                    <Grid item={true} xs={12} sm={6}>
                        <MyTextField
                            id="campoTopico"
                            variant="outlined"
                            select={true}
                            label="Tópico"
                            name="topico"
                            disabled={topico.length === 0 ? true : false}
                            value={(questao.disciplina.nome !== '') ? (topico.length > 0 ? questao.topico.nome : '') : ''}
                            error={questao.erros.topico ? true : false}>

                            { topico !== undefined &&
                                topico.length >= 1 
                                ? topico.map((row, index) => {
                                    return <MenuItem key={index} value={row.topico} onClick={() => handleChange("topico", row._id, row.topico)}>{row.topico}</MenuItem>
                                })
                                : <MenuItem key={topico._id} value={topico.topico} onClick={() => handleChange("topico", topico._id, topico.topico)}>{topico.topico}</MenuItem>
                            }

                        </MyTextField>
                        {questao.erros.topico && <p className={classes.errorMessage}>{questao.erros.topico}</p>}
                    </Grid>
                </Grid>

                <ChipsArray
                    disciplinaID={questao.disciplina.id}
                    selectedTag={selectedTag}
                    setSelectedTag={setSelectedTag}
                    handleTag={handleTag}
                />

            </section>
                
            <section className="enunciadoQuestao">
                <h2 className="subtitle-page">Enunciado</h2>
                <MyCard className={questao.erros.enunciado && classes.errorAlarm}>
                    <TextEditor 
                        optionType={false}
                        text={questao.enunciado} 
                        setText={handleEnunciado}
                        readOnly={false}
                        initialMessage="<p><span style='color:hsl(0, 0%, 30%)'>Digite o enunciado aqui</span></p>"
                    />
                </MyCard>
                {questao.erros.enunciado && <p className={classes.errorMessage}>{questao.erros.enunciado}</p>}
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

                    <Grid item={true} xs={12} md={4} sm={4}>
                        <div className="questaoTipo">
                            <ButtonGroup size="small" variant="contained" color="primary" aria-label="contained primary button group">
                                <Button onClick={() => handleResposta("multiplaEscolha")}>Múltipla Escolha</Button>
                                <Button onClick={() => handleResposta("discursiva")}>Discursiva</Button>
                            </ButtonGroup>
                        </div>
                    </Grid>
                </Grid>

                <MyCard 
                    className={questao.erros.resposta && classes.errorAlarm}
                    hidden={questao.tipoResposta === "discursiva" ? true : false}
                >
                        <label id="gabaritoLabel">Gabarito</label>
                        
                        {opcoes.map((item, index) => {
                            let tam = opcoes.length;
                            return (
                                <Grid key={index} className={classes.questaoOpcoes} container={true} spacing={2}>
                                    <Grid item={true} xs={2} sm={1} lg={1}>
                                        <Checkbox
                                            checked={item.gabarito}
                                            className={classes.checkBox}
                                            onChange={() => handleGabarito(index)}
                                            inputProps={{ 'aria-label': 'primary checkbox' }}/>
                                    </Grid>

                                    <Grid item={true} xs={8} sm={10} lg={10}>
                                        <div className="questionEditor">
                                            <TextEditor 
                                                optionType={true}
                                                opcoes={opcoes}
                                                text={item.opcao} 
                                                setText={handleOpcao}
                                                position={index}
                                                readOnly={false}
                                                initialMessage={`<p><span style='color:hsl(0, 0%, 30%)'>Opção de resposta</span></p>`}
                                                />
                                        </div>
                                    </Grid>

                                    <Grid item={true} xs={2} sm={1} lg={1}>
                                        {index === tam-1 
                                            ?   <Fab className={classes.fabButton} onClick={addNewOption} size="small" color="primary" aria-label="add">
                                                    <AddIcon />
                                                </Fab>
                                            :   <Fab className={classes.fabButton} onClick={(event) => deleteThisOption (event, index)} size="small" color="secondary" aria-label="add">
                                                    <DeleteIcon />
                                                </Fab>
                                        } 
                                    </Grid>
                                </Grid>
                            )
                        })}
                    </MyCard>
                    {questao.erros.resposta && <p className={classes.errorMessage}>{questao.erros.resposta}</p>}
            </section>
        
            <section className="padraoResposta">
                <h2 className="subtitle-page">Padrão Resposta</h2>
                <MyCard className={questao.erros.enunciado && classes.errorAlarm}>
                    <TextEditor 
                        optionType={false}
                        text={questao.padraoResposta} 
                        setText={handlePadraoResposta}
                        readOnly={false}
                        initialMessage="<p><span style='color:hsl(0, 0%, 30%)'>Digite aqui o padrão resposta da questão</span></p>"
                    />
                </MyCard>
            </section>

            <section className="grupoBotoes">
                <AddButton onClick={saveQuestion}>Salvar</AddButton>
                <Link to="/controle-questoes/list" style={{ textDecoration: 'none' }}>
                    <DeleteButton>Cancelar</DeleteButton>
                </Link>
            </section>
        </MyContainer> 
    )
}