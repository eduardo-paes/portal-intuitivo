import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import api from '../../api'

// -- Estilos e Componentes
import { makeStyles } from '@material-ui/core/styles';
import { Grid, MenuItem } from '@material-ui/core';
import { QuestionTable, QuestionDialog } from "../../components";
import { MyContainer, MyTextField, AddButton, DeleteButton, GeneralTitle } from "../../assets/styles/styledComponents"

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
    const { atividade, setAtividade, saveActivity, saveRevision, initialState, isRevision, clear } = props;

    // -- Define principais constantes
    const classes = useStyles();
    const [listaDisciplinas, setListaDisciplinas] = useState([]);               // Disciplinas do Banco de Dados
    const [topicos, setTopicos] = useState([]);                                 // Tópicos do Banco de Dados
    const [questoes, setQuestoes] = useState([]);                               // Questões do Banco de Dados
    const [revisao, setRevisao] = useState(isRevision);                         // Flag para verificar se é revisão
    const [questaoSelecionada, setQuestaoSelecionada] = useState('');           // Questões selecionadas da tabela
    const [filterDialog, setFilterDialog] = useState(false);
    const [hiddenDialog, setHiddenDialog] = useState(false);
    const indexNumeracao = [1, 2, 3, 4]
    const [count, setCount] = useState(6);

    // --- Funções de Carregamento da API
    // =================================
    // -- CARREGA DISCIPLINAS
    async function fetchDisciplinaAPI() {
        const response = await api.listarDisciplinas();
        if (response.data.success) {
            setListaDisciplinas(response.data.data);
        }
    }

    // -- CARREGA TÓPICOS
    async function fetchTopicoAPI() {
        if (atividade.disciplinaID !== '') {
            const response = await api.listarConteudoPorDisciplina(atividade.disciplinaID);
            if (response.data.success) {
                setTopicos(response.data.data);
            }
        }
    }

    // -- CARREGA QUESTÕES POR TÓPICO
    async function fetchQuestoesPorTopicoAPI() {
        if (atividade.topicoID !== '') {
            setQuestoes([]);
            const response = await api.listarQuestaoPorTopico(atividade.topicoID);
            if (response.data.success) {
                setQuestoes(response.data.data);
            }
        }
    }

    // -- CARREGA QUESTÕES POR ÁREA DO CONHECIMENTO
    async function fetchQuestoesPorAreaAPI() {
        if (atividade.areaConhecimento !== '') {
            setQuestoes([]);
            const response = await api.listarQuestaoPorArea(atividade.areaConhecimento);
            if (response.data.success) {
                setQuestoes(response.data.data);
            }
        }
    }

    // --- Funções de Alteração no formulário
    // =================================
    // -- Salva alterações do formulário
    async function handleChange (event) {
        const {name, value} = event.target;
        setAtividade(preValue => ({
            ...preValue,
            [name]: value
        }));
    }

    // -- Salva Disciplina/Tópico e Área do Conhecimento juntos
    async function handleSubjectChange (nome, id, area) {
        if (nome === "disciplinaID") {
            setAtividade(preValue => ({
                ...preValue,
                [nome]: id,
                areaConhecimento: area
            }));
        } else {
            setAtividade(preValue => ({
                ...preValue,
                [nome]: id
            }));
        }
    }

    // --- Funções de "VIGILÂNCIA" - UseEffect
    // =================================
    // -- Carregamentos iniciais
    useEffect(() => {
        const abortController = new AbortController();
        fetchDisciplinaAPI();   // Carrega disciplinas
        return abortController.abort();
        // eslint-disable-next-line
    }, []);

    // -- Carregamentos iniciais
    const [aux, setAux] = useState(15);
    useEffect(() => {
        const abortController = new AbortController();
        if (aux) {
            revisao && fetchQuestoesPorAreaAPI();
            setAux(aux - 1)
        }
        return abortController.abort();
        // eslint-disable-next-line
    }, [aux]);

    // -- Atualização inicial da variável QuestaoSelecionada
    useEffect(() => {
        const abortController = new AbortController();
        if (count) {
            setQuestaoSelecionada(atividade.questoes);  // Atualiza questões selecionadas
            setCount(count-1);
        }
        return abortController.abort();
        // eslint-disable-next-line
    }, [atividade.questoes]);

    // -- Altera o valor de revisão e limpa campos, caso o tipo de exercício seja igual à revisao
    useEffect(() => { 
        // Verifica se é uma avaliação diagnóstica
        if (atividade.tipoAtividade === "Avaliação Diagnóstica") {
            // Limpa campos Disciplina, Tópico e Questões
            setAtividade(preValue => ({ 
                ...preValue, 
                topicoID: "", 
                disciplinaID: ""
            }));
            setRevisao(true);
        } else {
            setRevisao(false);
        }
    // eslint-disable-next-line
    }, [atividade.tipoAtividade])

    // -- Carrega os Tópicos, por Disciplina, existentes no banco
    useEffect(() => {
        const abortController = new AbortController();
        !revisao && fetchTopicoAPI();
        return abortController.abort();
        // eslint-disable-next-line
    }, [atividade.disciplinaID]);

    // -- Carrega as Questões, por Tópico, existentes no banco
    useEffect(() => {
        const abortController = new AbortController();
        !revisao && fetchQuestoesPorTopicoAPI();
        return abortController.abort();
        // eslint-disable-next-line
    }, [atividade.topicoID]);

    // -- Carrega as Questões, por Área do conhecimento, existentes no banco
    useEffect(() => {
        const abortController = new AbortController();
        revisao && fetchQuestoesPorAreaAPI();
        return abortController.abort();
        // eslint-disable-next-line
    }, [atividade.areaConhecimento]);

    // -- Observa mudanças em questão selecionada
    useEffect(() => { 
        const abortController = new AbortController();
        setQuestaoSelecionada(questaoSelecionada) 
        return abortController.abort();
        // eslint-disable-next-line
    }, [questaoSelecionada]);

    // -- Limpa os campos do formulário
    useEffect(() => {
        const abortController = new AbortController();
        if (clear) {
            setAtividade(initialState)
            setQuestoes([])
            setQuestaoSelecionada('')
        }
        return abortController.abort();
        // eslint-disable-next-line
    }, [clear]);

    return (
        <MyContainer>
            <section id="cabecalhoAtividade">
                <GeneralTitle>Inserir Atividades</GeneralTitle>

                <Grid container={true} spacing={1}>
                    {/* TipoAtividade */}
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
                                <MenuItem value="Nenhum">Nenhum</MenuItem>
                                <MenuItem value="Aprofundamento">Aprofundamento</MenuItem>
                                <MenuItem value="Avaliação Diagnóstica">Avaliação Diagnóstica</MenuItem>
                                <MenuItem value="Fixação">Fixação</MenuItem>
                                <MenuItem value="Redação">Redação</MenuItem>
                                <MenuItem value="Retomada">Retomada</MenuItem>
                        </MyTextField>
                        {atividade.erros.tipoAtividade && <p className={classes.errorMessage}>{atividade.erros.tipoAtividade}</p>}
                    </Grid>

                    {/* Disciplina */}
                    <Grid item={true} xs={12} sm={6}>
                        <MyTextField
                            id="campoDisciplina"
                            variant="outlined"
                            select={true}
                            label="Disciplina"
                            name="disciplinaID"
                            disabled={revisao}
                            value={atividade.disciplinaID ? (listaDisciplinas.length > 0 ? atividade.disciplinaID : '') : ''}
                            error={atividade.erros.disciplina ? true : false}>
                                {
                                    listaDisciplinas.map((row, index) => {
                                        if (atividade.tipoAtividade === "Redação") {
                                            if (row.areaConhecimento === 'Linguagens') {
                                                return <MenuItem key={index} value={row._id} onClick={() => handleSubjectChange("disciplinaID", row._id, row.areaConhecimento)}>{row.nome}</MenuItem>
                                            }
                                            // eslint-disable-next-line
                                            return;
                                        }
                                        return <MenuItem key={index} value={row._id} onClick={() => handleSubjectChange("disciplinaID", row._id, row.areaConhecimento)}>{row.nome}</MenuItem>
                                    })
                                }
                        </MyTextField>
                        {atividade.erros.disciplina && <p className={classes.errorMessage}>{atividade.erros.disciplina}</p>}
                    </Grid>
                </Grid>
                
                <Grid container={true} spacing={1}>
                    {/* Topico */}
                    <Grid item={true} xs={12} sm={revisao ? 5 : 6}>
                        <MyTextField
                            id="campoTopico"
                            variant="outlined"
                            select={true}
                            label="Tópico"
                            name="topicoID"
                            disabled={(topicos.length === 0 ? true : false) || (revisao)}
                            value={(atividade.disciplinaID !== '') ? (topicos.length > 0 ? atividade.topicoID : '') : ''}
                            error={atividade.erros.topico ? true : false}>
                                { topicos !== undefined &&
                                    topicos.length >= 1 
                                    ? topicos.map((row, index) => {
                                        return <MenuItem key={index} value={row._id} onClick={() => handleSubjectChange("topicoID", row._id)}>{row.topico}</MenuItem>
                                    })
                                    : <MenuItem key={topicos._id} value={topicos._id} onClick={() => handleSubjectChange("topicoID", topicos._id)}>{topicos.topico}</MenuItem>
                                }
                        </MyTextField>
                        {atividade.erros.topico && <p className={classes.errorMessage}>{atividade.erros.topico}</p>}
                    </Grid>
                    
                    {/* Numeração */}
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
                    
                    {/* ÁreaConhecimento */}
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

                <QuestionTable 
                    data={questoes} 
                    setData={setAtividade} 
                    setQuestion={setQuestaoSelecionada} 
                    filterDialog={filterDialog}
                    setFilterDialog={setFilterDialog}
                    setHidden={setHiddenDialog} 
                    tableSelection={true}
                    selectedQuestions={questaoSelecionada}
                    activity={atividade}
                />
                { atividade.erros.questoes && <p className={classes.errorMessage}>{atividade.erros.questoes}</p> }

                <QuestionDialog 
                    enunciado={questaoSelecionada.enunciado}
                    tipoResposta={questaoSelecionada.tipoResposta}
                    resposta={questaoSelecionada.resposta}
                    open={hiddenDialog}
                    setOpen={setHiddenDialog}
                />
            </section>

            <section id="submitButtons" className={classes.group}>
                <Grid container={true} spacing={2} justify='center'>
                    <Grid item={true} xs={6} sm={3}>
                        <AddButton fullWidth={true} onClick={revisao ? saveRevision : saveActivity}>Salvar</AddButton>
                    </Grid>
                    <Grid item={true} xs={6} sm={3}>
                        <Link to="/controle-atividade/list" style={{ textDecoration: 'none' }}>
                            <DeleteButton fullWidth={true}>Voltar</DeleteButton>
                        </Link>
                    </Grid>
                </Grid>
            </section>

        </MyContainer>
    );
}