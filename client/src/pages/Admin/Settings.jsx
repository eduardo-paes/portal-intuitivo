import React, {useState, useEffect} from 'react'
import { MyContainer, MyTextField } from "../../assets/styles/styledComponents"
import { DisTable, TagTable } from "../../components"
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
    },
    sectionTag: {
        marginTop: theme.spacing(2),
    }
}));

const initialState = {
    nome: "",
    diaSemana: '',
    areaConhecimento: ''
}

const initialTagState = {
    nome: "",
    disciplinaID: ''
}

function Settings(props) {
    const classes = useStyles();
    const [listaDisciplina, setListaDisciplina] = useState([]);     // Disciplinas do Banco
    const [listaTag, setListaTag] = useState([]);                   // Tags do Banco
    const [disciplina, setDisciplina] = useState(initialState);     // Constante para armazenamento da DISCIPLINA
    const [tag, setTag] = useState(initialTagState)                 // Constante para armazenamento da TAG
    const [subjectID, setEditSubject] = useState(null);             // Constante para verificar se há edição em DISCIPLINA
    const [tagID, setEditTag] = useState(null);                     // Constante para verificar se há edição em TAG
    const [mount, setMount] = useState({
        disciplina: true,
        tag: true
    })
    
    // Lista DISCIPLINAS em tela
    useEffect(() => {
        const abortController = new AbortController();
        async function fetchDisciplinaAPI() {
            let response = await api.listarDisciplinas();
            setListaDisciplina(response.data.data);
        }
        fetchDisciplinaAPI();
        setMount(preValue => ({...preValue, disciplina: false}));
        return abortController.abort();
    }, [mount.disciplina]);

    // Lista TAGS em tela
    useEffect(() => {
        const abortController = new AbortController();
        async function fetchTagAPI() {
            let response = await api.listarTags();
            let value = response.data.data;
            setListaTag(value);
        }
        fetchTagAPI();
        setMount(preValue => ({...preValue, tag: false}));
        return abortController.abort();
    }, [mount.tag]);

    // Função para pegar os valores do formulário
    const handleChange = event => {
        const {name, value} = event.target;
        setDisciplina(preValue => ({
            ...preValue,
            [name]: value
        }));
    }

    // Função para pegar os valores do formulário
    const handleTagChange = event => {
        const {name, value} = event.target;
        setTag(preValue => ({
            ...preValue,
            [name]: value
        }));
    }

    // Guarda nova disciplina no banco
    async function saveChange() {
        await api
            .inserirDisciplina(disciplina)
            .then(res => {
                // Limpa os campos
                if (res.status === 201) {
                    setDisciplina(initialState);
                    setMount(preValue => ({...preValue, disciplina: true}));
                }
            })
    }

    // Guarda nova tag no banco
    async function saveTagChange() {
        console.log(tag)
        await api
            .inserirTag(tag)
            .then(res => {
                // Limpa os campos
                if (res.status === 201) {
                    setTag(initialTagState);
                    setMount(preValue => ({...preValue, tag: true}));
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
                    setMount(preValue => ({...preValue, disciplina: true}));
                    setEditSubject(null);
                }
            })
    }

    // Guarda disciplina atualizada no banco
    async function editTagChange() {
        await api
            .atualizarTag(tagID, tag)
            .then(res => {
                // Limpa os campos
                if (res.status === 201) {
                    setTag(initialTagState);
                    setMount(preValue => ({...preValue, tag: true}));
                    setEditTag(null);
                }
            })
    }

    return (
        <MyContainer>
            <h1 className="heading-page">Configurações</h1>

            <section id="gerenciarDisciplina">
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                            <h2 className="heading-page">Gerenciar Disciplinas</h2>
                        </AccordionSummary>

                        <AccordionDetails>
                            <Grid container={true} className={classes.root} spacing={2}>
                                <Grid item={true} xs={12} sm={6}>
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
                                            <MenuItem value="Ciências Humanas">Ciências Humanas</MenuItem>
                                            <MenuItem value="Ciências da Natureza">Ciências da Natureza</MenuItem>
                                            <MenuItem value="Linguagens">Linguagens</MenuItem>
                                            <MenuItem value="Matemática">Matemática</MenuItem>
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

                                <Grid item={true} xs={12} sm={6}>
                                    <DisTable 
                                        pushSubject={setDisciplina}
                                        setID={setEditSubject}
                                        data={listaDisciplina}/>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
            </section>
            
            <section id="gerenciarTag" className={classes.sectionTag}>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                            <h2 className="heading-page">Gerenciar Tags</h2>
                        </AccordionSummary>

                        <AccordionDetails>
                            <Grid container={true} className={classes.root} spacing={2}>
                                <Grid item={true} xs={12} sm={6}>
                                    <MyTextField
                                        id="campoTagNome"
                                        variant="outlined"
                                        label="Nome"
                                        name="nome"
                                        type="text"
                                        value={tag.nome}
                                        onChange={handleTagChange}/>

                                    <MyTextField
                                        id="campoDia"
                                        variant="outlined"
                                        select={true}
                                        label="Diciplina"
                                        name="disciplinaID"
                                        value={tag.disciplinaID}
                                        onChange={handleTagChange}>
                                        {listaDisciplina.map(disItem => {
                                            return <MenuItem key={disItem._id} value={disItem._id}>{disItem.nome}</MenuItem>
                                        })}
                                    </MyTextField>

                                    <div className={classes.group}>
                                        <Button
                                            className={classes.buttons}
                                            variant="outlined"
                                            type="submit"
                                            color="secondary"
                                            onClick={() => setTag(initialTagState)}>
                                            Limpar
                                        </Button>
                                        <Button
                                            className={classes.buttons}
                                            variant="outlined"
                                            type="submit"
                                            color="primary"
                                            onClick={tagID ? editTagChange : saveTagChange}>
                                            Salvar
                                        </Button>
                                    </div>
                                </Grid>

                                <Grid item={true} xs={12} sm={6}>
                                    <TagTable 
                                        pushTag={setTag}
                                        setTagID={setEditTag}
                                        data={listaTag}
                                    />
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
            </section>
            
        </MyContainer>
    );
};

export default Settings;
