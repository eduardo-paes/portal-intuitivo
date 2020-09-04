import React, { useState, useEffect } from "react";
import api from '../../api'

import { QuestionTable, CustomDialog } from "../../components";

// -- Estilos
import { Grid, MenuItem, Button } from '@material-ui/core';
import { MyContainer, MyTextField } from "../../assets/styles/styledComponents"
import { makeStyles } from '@material-ui/core/styles';

// -- Estilos locais
const useStyles = makeStyles((theme) => ({
    buttons: {
        marginTop: theme.spacing(2),
        margin: theme.spacing(1)
    },
    group: {
        textAlign: "center"
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

export default function ActivityForm (props) {
    const {atividade, setAtividade, saveActivity, initialState} = props;

    // -- Define principais constantes
    const classes = useStyles();
    const [listaDisciplinas, setListaDisciplinas] = useState([]);               // Disciplinas do Banco de Dados
    const [topicos, setTopicos] = useState([]);                                 // Tópicos do Banco de Dados
    const [questoes, setQuestoes] = useState([]);                               // Questões do Banco de Dados
    const [revisao, setRevisao] = useState(false);
    const [questaoSelecionada, setQuestaoSelecionada] = useState('');
    const [hiddenDialog, setHiddenDialog] = useState(false);
    const indexNumeracao = [1, 2, 3, 4]

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

    // -- Carrega os Tópicos, por Disciplina, existentes no banco
    useEffect(() => {
        const abortController = new AbortController();
        if (atividade.disciplina.id !== '') {
            setQuestoes([]);
            async function fetchTopicoAPI() {
                const response = await api.listarConteudoPorDisciplina(atividade.disciplina.id);
                setTopicos(response.data.data);
                setAtividade(preValue => ({ ...preValue, topico: { id: "", nome: "" }}));
            }
            fetchTopicoAPI()
        }
        return abortController.abort();
        // eslint-disable-next-line
    }, [atividade.disciplina.id]);

    // -- Carrega as Questões, por Tópico, existentes no banco
    useEffect(() => {
        const abortController = new AbortController();
        if (atividade.topico.id !== '' && !revisao) {
            setQuestoes([]);
            async function fetchQuestoesPorTopicoAPI() {
                const response = await api.listarQuestaoPorTopico(atividade.topico.id);
                if (response.status === 200) {
                    setQuestoes(response.data.data);
                }
            }
            fetchQuestoesPorTopicoAPI()
        }
        return abortController.abort();
        // eslint-disable-next-line
    }, [atividade.topico.id]);

    // -- Carrega as Questões, por Área do conhecimento, existentes no banco
    useEffect(() => {
        const abortController = new AbortController();
        if (atividade.areaConhecimento !== "" && revisao) {
            async function fetchQuestoesPorAreaAPI() {
                const response = await api.listarQuestaoPorArea(atividade.topico.id);
                const value = response.data.data;
                setQuestoes(value);
            }
            fetchQuestoesPorAreaAPI()
        }
        return abortController.abort();
        // eslint-disable-next-line
    }, [atividade.areaConhecimento]);

    // -- Definição das Funções
    function handleChange (event) {
        const {name, value} = event.target;
        setAtividade(preValue => ({
            ...preValue,
            [name]: value
        }));
    }

    // -- Salva Disciplina/Tópico e Área do Conhecimento juntos
    function handleSubjectChange (field, id, nome, area) {
        if (field === "disciplina") {
            setAtividade(preValue => ({
                ...preValue,
                [field]: {
                    id: id,
                    nome: nome
                },
                areaConhecimento: area
            }));
        } else {
            setAtividade(preValue => ({
                ...preValue,
                [field]: {
                    id: id,
                    nome: nome
                }
            }));
        }
    }

    // -- Limpa os campos do formulário
    function clearChange (event) {
        event.preventDefault();
        setAtividade(initialState)
        setQuestoes([])
    }

    // -- Altera o valor de revisão e limpa campos, caso o tipo de exercício seja igual à revisao
    useEffect(() => { 
        if (atividade.tipoAtividade === "Avaliação Diagnóstica") {
            setRevisao(true);
            // Limpa campos Disciplina e Tópico
            setAtividade(preValue => ({ ...preValue, topico: { id: "", nome: "" }, disciplina: { id: "", nome: "" }}));
            setQuestoes([]);
        } else {
            setRevisao(false);
        }
    // eslint-disable-next-line
    }, [atividade.tipoAtividade])

    // -- Observa mudanças em questão selecionada
    useEffect(() => {
        setQuestaoSelecionada(questaoSelecionada)
    }, [questaoSelecionada]);

    return (
        <MyContainer>
            <section id="cabecalhoAtividade">
                <h1 className="heading-page">Inserir Atividade</h1>

                <Grid container={true} spacing={1}>
                    <Grid item={true} xs={12} sm={6}>
                        <MyTextField
                            id="campoTipo"
                            variant="outlined"
                            select={true}
                            label="Tipo de Atividade"
                            name="tipoAtividade"
                            value={atividade.tipoAtividade ? atividade.tipoAtividade : ""}
                            onChange={handleChange}
                            error={atividade.erros.tipoAtividade ? true : false}>
                                <MenuItem value="Fixação">Fixação</MenuItem>
                                <MenuItem value="Retomada">Retomada</MenuItem>
                                <MenuItem value="Aprofundamento">Aprofundamento</MenuItem>
                                <MenuItem value="Avaliação Diagnóstica">Avaliação Diagnóstica</MenuItem>
                        </MyTextField>
                        {atividade.erros.tipoAtividade && <p className={classes.errorMessage}>{atividade.erros.tipoAtividade}</p>}
                    </Grid>

                    <Grid item={true} xs={12} sm={6}>
                        <MyTextField
                            id="campoDisciplina"
                            variant="outlined"
                            select={true}
                            label="Disciplina"
                            name="disciplina"
                            disabled={revisao}
                            value={atividade.disciplina.nome}
                            error={atividade.erros.disciplina ? true : false}>
                                {
                                    listaDisciplinas.map((row, index) => {
                                        return <MenuItem key={index} value={row.nome} onClick={() => handleSubjectChange("disciplina", row._id, row.nome, row.areaConhecimento)}>{row.nome}</MenuItem>
                                    })
                                }
                        </MyTextField>
                        {atividade.erros.disciplina && <p className={classes.errorMessage}>{atividade.erros.disciplina}</p>}
                    </Grid>
                </Grid>
                
                <Grid container={true} spacing={1}>
                    <Grid item={true} xs={12} sm={revisao ? 5 : 6}>
                        <MyTextField
                            id="campoTopico"
                            variant="outlined"
                            select={true}
                            label="Tópico"
                            name="topico"
                            disabled={(topicos.length === 0 ? true : false) || (revisao)}
                            value={atividade.topico.nome}
                            error={atividade.erros.topico ? true : false}>
                                { topicos !== undefined &&
                                    topicos.length >= 1 
                                    ? topicos.map((row, index) => {
                                        return <MenuItem key={index} value={row.topico} onClick={() => handleSubjectChange("topico", row._id, row.topico)}>{row.topico}</MenuItem>
                                    })
                                    : <MenuItem key={topicos._id} value={topicos.topico} onClick={() => handleSubjectChange("topico", topicos._id, topicos.topico)}>{topicos.topico}</MenuItem>
                                }
                        </MyTextField>
                        {atividade.erros.topico && <p className={classes.errorMessage}>{atividade.erros.topico}</p>}
                    </Grid>

                    <Grid item={true} hidden={!revisao} xs={12} sm={revisao && 2}>
                        <MyTextField
                            id="campoNumeracao"
                            variant="outlined"
                            select={true}
                            label="Numeração"
                            name="numeracao"
                            value={atividade.numeracao}
                            onChange={handleChange}
                            error={atividade.erros.numeracao ? true : false}>
                            {indexNumeracao.map(item => {
                                return <MenuItem key={item} value={item}>{item}</MenuItem>
                            })}
                        </MyTextField>
                        { (revisao && atividade.erros.numeracao) && <p className={classes.errorMessage}>{atividade.erros.numeracao}</p> }
                    </Grid>

                    <Grid item={true} xs={12} sm={revisao ? 5 : 6}>
                        <MyTextField
                            id="campoArea"
                            variant="outlined"
                            disabled={revisao ? false : (atividade.disciplina !== '' ? true : false)}
                            select={true}
                            label="Área do Conhecimento"
                            name="areaConhecimento"
                            value={atividade.areaConhecimento ? atividade.areaConhecimento : ""}
                            onChange={handleChange}
                            error={atividade.erros.areaConhecimento ? true : false}>
                                <MenuItem value="Ciências Humanas">Ciências Humanas</MenuItem>
                                <MenuItem value="Ciências da Natureza">Ciências da Natureza</MenuItem>
                                <MenuItem value="Linguagens">Linguagens</MenuItem>
                                <MenuItem value="Matemática">Matemática</MenuItem>
                        </MyTextField>
                        { (revisao && atividade.erros.areaConhecimento) && <p className={classes.errorMessage}>{atividade.erros.areaConhecimento}</p> }
                    </Grid>
                </Grid>
            </section>

            <section id="escolherQuestoes">
                <h2 className="heading-page">Escolha as Questões</h2>
                <QuestionTable data={questoes} setData={setAtividade} setQuestion={setQuestaoSelecionada} setHidden={setHiddenDialog} tableSelection={true}/>
                { atividade.erros.questoes && <p className={classes.errorMessage}>{atividade.erros.questoes}</p> }

                <CustomDialog 
                    enunciado={questaoSelecionada.enunciado}
                    tipoResposta={questaoSelecionada.tipoResposta}
                    resposta={questaoSelecionada.resposta}
                    open={hiddenDialog}
                    setOpen={setHiddenDialog}
                />
            </section>

            <section id="submitButtons" className={classes.group}>
                <Button
                    className={classes.buttons}
                    variant="outlined"
                    type="submit"
                    color="secondary"
                    onClick={clearChange}>
                    Limpar
                </Button>
                <Button
                    className={classes.buttons}
                    variant="outlined"
                    type="submit"
                    color="primary"
                    onClick={saveActivity}>
                    Salvar
                </Button>
            </section>

        </MyContainer>
    );
}