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

function QuestionForm (props) {
    const classes = useStyles();
    const {title, questao, disciplina, opcoes, autor} = props;
    const {handleQuestionChange, handleOptionChange, addNewOption, saveQuestion, deleteThisOption} = props;

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
    )
}

export default QuestionForm;