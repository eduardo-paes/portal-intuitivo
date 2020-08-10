import React, {useContext, useState, useEffect} from "react";
import {StoreContext} from "../../utils"
import api from '../../api'

// -- Estilos
import {Grid, MenuItem, Button} from '@material-ui/core';
import {MyContainer, MyTextField, MyCard, MyCardContent} from "../../assets/styles/styledComponents"
import {makeStyles} from '@material-ui/core/styles';

// -- Dados iniciais da constante Atividade
function initialState() {
    return {
        tipoAtividade: "",
        disciplina: "",
        areaConhecimento: "",
        topico: "",
        questoes: "",
        dataCriacao: new Date(),
        dataModificacao: new Date(),
        autor: {
            id: "",
            nome: "",
        }
    }
}

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

function Exercises(props) {
    // -- Define principais constantes
    const classes = useStyles();
    const {token} = useContext(StoreContext);
    const [atividade, setAtividade] = useState(initialState);   // Guarda as alterações temporárias do formulário
    const [disciplina, setDisciplina] = useState([]);           // Disciplinas do Banco de Dados

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
        setAtividade(preValue => ({
            ...preValue,
            [name]: value
        }));
    }

    // -- Salva Disciplina e Área do Conhecimento juntos
    function handleSubjectChange (event) {
        const {value} = event.target;

        var aux = disciplina.filter(item => {
            return item._id === value
        })

        setAtividade(preValue => ({
            ...preValue,
            disciplina: value,
            areaConhecimento: aux[0].areaConhecimento
        }));
    }

    // -- Salva as alterações feitas no banco*
    const saveChange = () => {
        // Caso seja uma Avaliação Diagnóstica, não está relacionada com uma disciplina
        if (atividade.tipo === "revisao") {
            setAtividade(preValue => ({
                ...preValue,
                disciplina: "",
                autor: {
                    id: token.userID,
                    nome: token.userName
                },
                dataModificacao: new Date(),
            }));
        } else {
            setAtividade(preValue => ({
                ...preValue,
                autor: {
                    id: token.userID,
                    nome: token.userName
                },
                dataModificacao: new Date(),
            }));
        }
    }

    // -- Limpa os campos do formulário
    const clearChange = (event) => {
        event.preventDefault();
        setAtividade(initialState)
    }

    return (
        <MyContainer>
            <header>
                <h1 className="heading-page">Atividades</h1>

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
                            <MenuItem value="revisao">Retomada</MenuItem>
                            <MenuItem value="aprofundamento">Aprofundamento</MenuItem>
                            <MenuItem value="revisao">Avaliação Diagnóstica</MenuItem>
                        </MyTextField>
                    </Grid>

                    <Grid item={true} xs={12} sm={6}>
                        <MyTextField
                            id="campoDisciplina"
                            variant="outlined"
                            disabled={atividade.tipoExercicio === "revisao" ? true : false}
                            select={true}
                            label="Disciplina"
                            name="disciplina"
                            value={atividade.disciplina}
                            onChange={handleSubjectChange}>
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
                            value={atividade.topico}
                            onChange={handleChange}/>
                    </Grid>

                    <Grid item={true} xs={12} sm={6}>
                        <MyTextField
                            id="campoArea"
                            variant="outlined"
                            disabled={atividade.tipoExercicio === "revisao" ? false : (atividade.disciplina ? true : false)}
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

                <div className={classes.group}>
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
                </div>
            </header>

            <main>
                <h2 className="heading-page">Escolha as Questões</h2>
                
                <MyCard>
                    <MyCardContent>
                        <p>Questões aqui</p>
                    </MyCardContent>
                </MyCard>
            </main>

        </MyContainer>
    );
};

export default Exercises;