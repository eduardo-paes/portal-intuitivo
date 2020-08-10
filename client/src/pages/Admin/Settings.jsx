import React, {useState, useEffect} from 'react'
import {MyContainer, MyTextField} from "../../assets/styles/styledComponents"
import {DisTable} from "../../components"
import api from '../../api'

// Material-UI
import {
    MenuItem,
    Grid,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {makeStyles} from '@material-ui/core/styles';

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
    }
}));

const initialState = {
    nome: "",
    diaSemana: '',
    areaConhecimento: ''
}

function Settings(props) {
    const classes = useStyles();
    const [data, setData] = useState([]);                           // Dados do Banco
    const [disciplina, setDisciplina] = useState(initialState);     // Constante para armazenamento dos dados do formulário
    const [subjectID, setEditSubject] = useState(null);             // Constante para verificar se há edição
    
    // Lista disciplinas em tela
    useEffect(() => {
        let unmounted = false;

        async function fetchChangeAPI() {
            let response = await api.listarDisciplinas();
            if (!unmounted) {
                setData(response.data.data);
            }
        }
        fetchChangeAPI();
        return () => {unmounted = true};
    }, [data]);

    // Função para pegar os valores do formulário
    const handleChange = event => {
        const {name, value} = event.target;
        setDisciplina(preValue => ({
            ...preValue,
            [name]: value
        }));
        console.log(disciplina.areaConhecimento);
    }

    // Guarda nova disciplina no banco
    async function saveChange() {
        await api
            .inserirDisciplina(disciplina)
            .then(res => {
                // Limpa os campos
                if (res.status === 201) {
                    setDisciplina(initialState);
                }
            })
    }

    // Guarda disciplina atualizada no banco
    async function editChange() {
        await api
            .atualizarDisciplina(subjectID, disciplina)
            .then(res => {
                console.log(disciplina);
                // Limpa os campos
                if (res.status === 201) {
                    setDisciplina(initialState);
                }
            })
        setEditSubject(null);
    }

    return (
        <MyContainer>
            <h1 className="heading-page">Configurações</h1>

            <Grid container={true} className={classes.root} spacing={2}>
                <Grid item={true} xs={12} sm={6}>
                    <Accordion>
                        <Grid item={true} xs={12}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header">
                                <h2 className="heading-page">Gerenciar Disciplinas</h2>
                            </AccordionSummary>
                        </Grid>

                        <Grid item={true} xs={12}>
                            <AccordionDetails>
                                <Grid item={true} xs={12} sm={12}>
                                    <MyTextField
                                        id="campoNome"
                                        variant="outlined"
                                        label="Nome"
                                        name="nome"
                                        type="text"
                                        value={disciplina.nome}
                                        onChange={handleChange}/>

                                    <MyTextField
                                        id="campoDia"
                                        variant="outlined"
                                        select={true}
                                        label="Dia da Semana"
                                        name="diaSemana"
                                        value={disciplina.diaSemana}
                                        onChange={handleChange}>
                                        <MenuItem value="1">Segunda-feira</MenuItem>
                                        <MenuItem value="2">Terça-feira</MenuItem>
                                        <MenuItem value="3">Quarta-feira</MenuItem>
                                        <MenuItem value="4">Quinta-feira</MenuItem>
                                        <MenuItem value="5">Sexta-feira</MenuItem>
                                    </MyTextField>

                                    <MyTextField
                                        id="campoArea"
                                        variant="outlined"
                                        select={true}
                                        label="Área do Conhecimento"
                                        name="areaConhecimento"
                                        value={disciplina.areaConhecimento ? disciplina.areaConhecimento : ""}
                                        onChange={handleChange}>
                                            <MenuItem value="cienciasHumanas">Ciências Humanas</MenuItem>
                                            <MenuItem value="cienciasDaNatureza">Ciências da Natureza</MenuItem>
                                            <MenuItem value="linguagens">Linguagens</MenuItem>
                                            <MenuItem value="matematica">Matemática</MenuItem>
                                    </MyTextField>

                                    <div className={classes.group}>
                                        <Button
                                            className={classes.buttons}
                                            variant="outlined"
                                            type="submit"
                                            color="secondary"
                                            onClick={() => setDisciplina(initialState)}>
                                            Limpar
                                        </Button>
                                        <Button
                                            className={classes.buttons}
                                            variant="outlined"
                                            type="submit"
                                            color="primary"
                                            onClick={subjectID ? editChange : saveChange}>
                                            Salvar
                                        </Button>
                                    </div>
                                </Grid>
                            </AccordionDetails>
                        </Grid>

                    </Accordion>
                </Grid>

                <Grid item={true} xs={12} sm={6}>
                    <DisTable 
                        pushSubject={setDisciplina}
                        setID={setEditSubject}
                        data={data}/>
                </Grid>
            </Grid>

        </MyContainer>
    );
};

export default Settings;
