import React, { useState, useEffect } from "react";
import api from '../../api'

import { QuestionTable } from "../../components";

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
    }
}));

export default function ActivityForm (props) {
    const {atividade, setAtividade, saveChange, initialState} = props;

    // -- Define principais constantes
    const classes = useStyles();
    const [listaDisciplinas, setListaDisciplinas] = useState([]);               // Disciplinas do Banco de Dados
    const [topicos, setTopicos] = useState([]);                                 // Tópicos do Banco de Dados
    const [questoes, setQuestoes] = useState([]);                               // Questões do Banco de Dados
    const [revisao, setRevisao] = useState(false);
    const [indexNumeracao, setIndexNumeracao] = useState(() => {
        let array = [];
        for (let index = 1; index < 33; index++) {
            array.push(index);
        }
        return array;
    });

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
            async function fetchTopicoAPI() {
                const response = await api.listarConteudoPorDisciplina(atividade.disciplina.id);
                const value = response.data.data;
                setTopicos(value);
            }
            fetchTopicoAPI()
        }
        return abortController.abort();
        // eslint-disable-next-line
    }, [atividade.disciplina.id]);

    // -- Carrega as Questões, por Tópico, existentes no banco
    useEffect(() => {
        const abortController = new AbortController();
        if (atividade.topico.id !== '' && atividade.tipoExercicio !== "revisao") {
            async function fetchQuestoesPorTopicoAPI() {
                const response = await api.listarQuestaoPorTopico(atividade.topico.id);
                const value = response.data.data;
                setQuestoes(value);
            }
            fetchQuestoesPorTopicoAPI()
        }
        return abortController.abort();
        // eslint-disable-next-line
    }, [atividade.topico.id]);

    // -- Carrega as Questões, por Área do conhecimento, existentes no banco
    useEffect(() => {
        const abortController = new AbortController();
        if (atividade.areaConhecimento !== "" && atividade.tipoExercicio === "revisao") {
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

    // -- Salva Disciplina e Área do Conhecimento juntos
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

    useEffect(() => {
        atividade.tipoExercicio === "revisao" ? setRevisao(true) : setRevisao(false);
        console.log(atividade)
    }, [atividade])

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
                            name="tipoExercicio"
                            value={atividade.tipoExercicio ? atividade.tipoExercicio : ""}
                            onChange={handleChange}>
                            <MenuItem value="fixacao">Fixação</MenuItem>
                            <MenuItem value="retomada">Retomada</MenuItem>
                            <MenuItem value="aprofundamento">Aprofundamento</MenuItem>
                            <MenuItem value="revisao">Avaliação Diagnóstica</MenuItem>
                        </MyTextField>
                    </Grid>

                    <Grid item={true} xs={12} sm={6}>
                        <MyTextField
                            id="campoDisciplina"
                            variant="outlined"
                            select={true}
                            label="Disciplina"
                            name="disciplina"
                            disabled={revisao}
                            value={atividade.disciplina.nome}>
                            {
                                listaDisciplinas.map((row, index) => {
                                    return <MenuItem key={index} value={row.nome} onClick={() => handleSubjectChange("disciplina", row._id, row.nome, row.areaConhecimento)}>{row.nome}</MenuItem>
                                })
                            }
                        </MyTextField>
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
                            value={atividade.topico.nome}>

                            { topicos !== undefined &&
                                topicos.length >= 1 
                                ? topicos.map((row, index) => {
                                    return <MenuItem key={index} value={row.topico} onClick={() => handleSubjectChange("topico", row._id, row.topico)}>{row.topico}</MenuItem>
                                })
                                : <MenuItem key={topicos._id} value={topicos.topico} onClick={() => handleSubjectChange("topico", topicos._id, topicos.topico)}>{topicos.topico}</MenuItem>
                            }

                        </MyTextField>
                    </Grid>

                    <Grid item={true} hidden={!revisao} xs={12} sm={revisao && 2}>
                        <MyTextField
                            id="campoNumeracao"
                            variant="outlined"
                            select={true}
                            label="Numeração"
                            name="numeracao"
                            value={atividade.numeracao}
                            onChange={handleChange}>
                            {indexNumeracao.map(item => {
                                return <MenuItem key={item} value={item}>{item}</MenuItem>
                            })}
                        </MyTextField>
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
                            onChange={handleChange}>
                            <MenuItem value="cienciasHumanas">Ciências Humanas</MenuItem>
                            <MenuItem value="cienciasDaNatureza">Ciências da Natureza</MenuItem>
                            <MenuItem value="linguagens">Linguagens</MenuItem>
                            <MenuItem value="matematica">Matemática</MenuItem>
                        </MyTextField>
                    </Grid>
                </Grid>
            </section>

            <section id="escolherQuestoes">
                <h2 className="heading-page">Escolha as Questões</h2>
                <QuestionTable data={questoes} tableSelection={true} setData={setAtividade}/>
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
                    onClick={saveChange}>
                    Salvar
                </Button>
            </section>

        </MyContainer>
    );
}