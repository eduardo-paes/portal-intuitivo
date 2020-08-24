import React from "react";
import {Link} from 'react-router-dom'

// -- Editor / Context
import { TextEditor } from "../";

// -- Styles
import { MyContainer, MyTextField, MyCard, AddButton, DeleteButton } from "../../assets/styles/styledComponents"
import { Grid, MenuItem, ButtonGroup, Button, Fab, Checkbox } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import "./stylesQuestionForm.css"

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
        padding: "1px",
    },
    questaoOpcoes: {
        padding: "1rem",
        textAlign: "center",
        alignItems: "center",
    }
}));

function QuestionForm (props) {
    const classes = useStyles();
 
    const {title, disciplina, questao, setQuestao, opcoes, setOpcoes, saveQuestion, initialOptionState} = props;

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

    // -- Salvar dados das opções da questão
    function handleOpcao(position, value, fromEditor) {
        if (fromEditor) {
            // Verifica se valor contém parágrafo e espaços vazios
            let blankSpace = value.includes('<p>&nbsp;</p>');
            let paragraphs = value.includes('</p><p>');
            
            // Se sim, Inserção múltipla de opções de resposta
            if (!blankSpace && paragraphs) {
                console.log("Múltiplo")
                // Separa o texto entre parágrafos
                var options = value.split('</p><p>').map(option => {
                    // Correções do split
                    if (option.includes('<p>')) {
                        option = option + '</p>';
                    } else if (option.includes('</p>')) {
                        option = '<p>' + option;
                    } else {
                        option = '<p>' + option + '</p>';
                    }

                    // Retorna um objeto opção contendo o tampo de opcao preenchido
                    return {
                        opcao: option,
                        gabarito: false,
                    }
                });

                // Verifica se o array de opções já contém algum valor
                var optionsAux = opcoes.filter((opcao, index) => {
                    let checking = opcoes[index].opcao.includes('');
                    return !checking && opcao;
                })
                var arrayAux = opcoes[0].opcao.includes('') ? [] : optionsAux;
                
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
                console.log("Individual")
                setOpcoes(opcoes.map((item, index) => {
                    if (index === position) {
                        return { ...item, opcao: value };
                    } else {
                        return item;
                    }
                }));
            }
        }
        console.log("handleOpcao", opcoes);
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
    function deleteThisOption(event, position) {
        setOpcoes(opcoes.filter((option, index) => {
            return index !== position;
        }));

        setQuestao(preValue => ({
            ...preValue,
            resposta: opcoes
        }));
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

    return (
        <MyContainer>
            <section className="cabecalhoQuestao">
                <Grid container={true} className={classes.root} spacing={2}>
                    <Grid item={true} xs={12} sm={9}>
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
                    text={questao.enunciado} 
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
                        <div className="questaoTipo">
                            <ButtonGroup size="small" variant="contained" color="primary" aria-label="contained primary button group">
                                <Button onClick={() => handleResposta("multiplaEscolha")}>Múltipla Escolha</Button>
                                <Button onClick={() => handleResposta("discursiva")}>Discursiva</Button>
                            </ButtonGroup>
                        </div>
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
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item={true} xs={2} sm={1}>
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
            </section>
        
            <section className="grupoBotoes">
                <AddButton onClick={saveQuestion}>Salvar</AddButton>
                <Link to="/controle-questoes/create" style={{ textDecoration: 'none' }}>
                    <DeleteButton>Cancelar</DeleteButton>
                </Link>
            </section>
        </MyContainer> 
    )
}

export default QuestionForm;