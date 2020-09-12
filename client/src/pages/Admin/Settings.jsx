import React, {useState, useEffect} from 'react'
import { MyContainer, MyTextField } from "../../assets/styles/styledComponents"
import { DisTable, TagTable, DatePicker } from "../../components"
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
import { makeStyles } from '@material-ui/core/styles';

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
    section: {
        marginTop: theme.spacing(2),
    }
}));

const initialSubjectState = {
    nome: "",
    diaSemana: '',
    areaConhecimento: ''
}

const initialTagState = {
    nome: "",
    disciplinaID: ''
}

const initialYearState = {
    dataInicio: new Date(),
    dataFim: new Date(),
    contagem: ''
}

export default function Settings(props) {
    const classes = useStyles();
    // -->
    const [listaDisciplina, setListaDisciplina] = useState([]);             // Disciplinas do Banco
    const [listaTag, setListaTag] = useState([]);                           // Tags do Banco
    const [listaAnoLetivo, setListaAnoLetivo] = useState([]);               // AnoLetivo do Banco
    // -->
    const [disciplina, setDisciplina] = useState(initialSubjectState);      // Constante para armazenamento da DISCIPLINA
    const [tag, setTag] = useState(initialTagState)                         // Constante para armazenamento da TAG
    const [anoLetivo, setAnoLetivo] = useState(initialYearState)            // Constante para armazenamento da ANOLETIVO
    // -->
    const [subjectID, setEditSubject] = useState(null);                     // Constante para verificar se há edição em DISCIPLINA
    const [tagID, setEditTag] = useState(null);                             // Constante para verificar se há edição em TAG
    // -->
    const [mount, setMount] = useState({
        disciplina: false,
        isMountedSubject: true,
        tag: false,
        isMountedTag: true,
        anoLetivo: false,
        isMountedYear: true
    })

    // -- API Fetchs
    // Lista DISCIPLINAS em tela
    async function fetchDisciplinaAPI() {
        let response = await api.listarDisciplinas();
        setListaDisciplina(response.data.data);
    }

    // Lista TAGS em tela
    async function fetchTagAPI() {
        let response = await api.listarTags();
        setListaTag(response.data.data);
    }

    // Lista ANO LETIVO em tela
    async function fetchYearAPI() {
        let response = await api.listarAnoLetivo();
        if (response.data.data.length) {
            setListaAnoLetivo(response.data.data);
        }
    }
    
    // Observa mudanças no conteúdo de listagem - Disciplina
    useEffect(() => {
        const abortController = new AbortController();
        setMount(mount);

        // Caso haja mudança em disciplina
        if (mount.disciplina) {
            fetchDisciplinaAPI();
            setMount(preValue => ({...preValue, disciplina: false}));
        }

        // Caso haja mudança em tag
        if (mount.tag) {
            fetchTagAPI();
            setMount(preValue => ({...preValue, tag: false}));
        }
        return abortController.abort();
    }, [mount])

    // Carregamento Inicial - Disciplina
    const initialSubjectLoad = () => {
        if (mount.isMountedSubject) {
            fetchDisciplinaAPI();
            setMount(preValue => ({...preValue, isMountedSubject: false}));
        }
    }

    // Carregamento Inicial - Tags
    const initialTagLoad = () => {
        if (mount.isMountedTag) {
            fetchTagAPI();
            setMount(preValue => ({...preValue, isMountedTag: false}));
            initialSubjectLoad();
        }
    }

    // Carregamento Inicial - Ano Letivo
    const initialYearLoad = () => {
        if (mount.isMountedYear) {
            fetchYearAPI();
            setMount(preValue => ({...preValue, isMountedYear: false}));
        }
    }

    // Função para pegar os valores do formulário
    const handleSubjectChange = event => {
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
    async function saveSubjectChange() {
        await api
            .inserirDisciplina(disciplina)
            .then(res => {
                console.log(disciplina)
                // Limpa os campos
                if (res.status === 201) {
                    setDisciplina(initialSubjectState);
                    setMount(preValue => ({...preValue, disciplina: true}));
                }
            })
    }

    // Guarda nova tag no banco
    async function saveTagChange() {
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

    // Guarda ano letivo no banco
    async function saveYearChange() {
        await api
            .inserirAnoLetivo(anoLetivo)
            .then(res => {
                // Limpa os campos
                if (res.status === 201) {
                    setMount(preValue => ({...preValue, anoLetivo: true}));
                }
            })
    }

    // Guarda disciplina atualizada no banco
    async function editSubjectChange() {
        await api
            .atualizarDisciplina(subjectID, disciplina)
            .then(res => {
                // Limpa os campos
                if (res.status === 200) {
                    setDisciplina(initialSubjectState);
                    setEditSubject(null);
                    setMount(preValue => ({...preValue, disciplina: true}));
                }
            })
    }

    // Guarda disciplina atualizada no banco
    async function editTagChange() {
        await api
            .atualizarTag(tagID, tag)
            .then(res => {
                // Limpa os campos
                if (res.status === 200) {
                    setTag(initialTagState);
                    setEditTag(null);
                    setMount(preValue => ({...preValue, tag: true}));
                }
            })
    }

    // Guarda ano letivo atualizado no banco
    async function editYearChange() {
        await api
            .atualizarYear(tagID, tag)
            .then(res => {
                // Limpa os campos
                if (res.status === 200) {
                    setMount(preValue => ({...preValue, anoLetivo: true}));
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
                            onClick={() => initialSubjectLoad()}
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
                                        onChange={handleSubjectChange}/>

                                    <MyTextField
                                        id="campoDia"
                                        variant="outlined"
                                        select={true}
                                        label="Dia da Semana"
                                        name="diaSemana"
                                        value={disciplina.diaSemana}
                                        onChange={handleSubjectChange}>
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
                                        onChange={handleSubjectChange}>
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
                                            onClick={() => setDisciplina(initialSubjectState)}>
                                            Limpar
                                        </Button>
                                        <Button
                                            className={classes.buttons}
                                            variant="outlined"
                                            type="submit"
                                            color="primary"
                                            onClick={subjectID ? editSubjectChange : saveSubjectChange}>
                                            Salvar
                                        </Button>
                                    </div>
                                </Grid>

                                <Grid item={true} xs={12} sm={6}>
                                    <DisTable 
                                        pushSubject={setDisciplina}
                                        setID={setEditSubject}
                                        data={listaDisciplina}
                                        setMount={setMount}/>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
            </section>
            
            <section id="gerenciarTag" className={classes.section}>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            onClick={() => initialTagLoad()}
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
                                        setMount={setMount}
                                    />
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
            </section>
            
            <section id="gerenciarAnoLetivo" className={classes.section}>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            onClick={() => initialYearLoad()}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                            <h2 className="heading-page">Gerenciar Ano Letivo</h2>
                        </AccordionSummary>

                        <AccordionDetails>
                            <Grid container={true} className={classes.root} spacing={2}>
                                <Grid item={true} xs={12} sm={6}>
                                    
                                    <Grid container={true} spacing={1}>
                                        <Grid item={true} xs={12} sm={6}>
                                            <DatePicker 
                                                selectedDate={anoLetivo.dataInicio} 
                                                setSelectedDate={setAnoLetivo} 
                                                label="Data de Início" 
                                                name="dataInicio"/>
                                        </Grid>

                                        <Grid item={true} xs={12} sm={6}>
                                            <DatePicker 
                                                selectedDate={anoLetivo.dataFim} 
                                                setSelectedDate={setAnoLetivo} 
                                                label="Data de Fim" 
                                                name="dataFim"/>
                                        </Grid>
                                    </Grid>

                                    <div className={classes.group}>
                                        <Button
                                            className={classes.buttons}
                                            variant="outlined"
                                            type="submit"
                                            color="secondary"
                                            onClick={() => setAnoLetivo(initialYearState)}>
                                            Limpar
                                        </Button>
                                        <Button
                                            className={classes.buttons}
                                            variant="outlined"
                                            type="submit"
                                            color="primary"
                                            onClick={tagID ? editYearChange : saveYearChange}>
                                            Salvar
                                        </Button>
                                    </div>
                                </Grid>

                                <Grid item={true} xs={12} sm={6}>
                                    <p>Ano Letivo</p>
                                    {/* <p>{anoLetivo.dataInicio}</p>
                                    <p>{anoLetivo.dataFim}</p> */}
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
            </section>
        
        </MyContainer>
    );
};


// npm i @date-io/date-fns@1.3.13 date-fns
// npm i @date-io/moment@1.3.13 moment

// npm i -s @date-io/luxon@1.3.13 luxon
// npm i -s @date-io/dayjs@1.3.13 dayjs