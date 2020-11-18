import React, {useState, useEffect} from 'react'
import { MyContainer, MyTextField, MyTypography, GeneralTitle } from "../../assets/styles/styledComponents"
import { DisTable, TagTable } from "../../components"
import api from '../../api'

// Material-UI
import { MenuItem, Grid, Button, Accordion, AccordionSummary, AccordionDetails, Divider, Paper, IconButton, InputBase } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InsertLinkIcon from '@material-ui/icons/InsertLink';
import SaveIcon from '@material-ui/icons/Save';
import { makeStyles } from '@material-ui/core/styles';

// DataPicker
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from "@date-io/moment";
import moment from "moment";
import "moment/locale/pt-br";

// Styles
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
    }, 
    dateGrid: {
        textAlign: "center",
    },
    classLink: {
        display: 'flex',
        alignItems: 'center',
        justifySelf: "center"
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
}));

// Constantes Auxiliares
const dateFormatter = str => { return str };

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
    // dataInicio: new Date(thisYear.getFullYear() + '/01/01T07:00:00'),
    // dataFim: new Date(thisYear.getFullYear() + '/12/31T07:00:00'),
    dataInicio: new Date(),
    dataFim: new Date(),
    contagem: 52
}

const initialClassLinkState = {
    aulaLink: ''
}

// Main Function
export default function Settings() {
    const classes = useStyles();

    // --> Listas
    const [listaDisciplina, setListaDisciplina] = useState([]);             // Disciplinas do Banco
    const [listaTag, setListaTag] = useState([]);                           // Tags do Banco

    // --> Conteúdo
    const [disciplina, setDisciplina] = useState(initialSubjectState);      // Constante para armazenamento da DISCIPLINA
    const [tag, setTag] = useState(initialTagState)                         // Constante para armazenamento da TAG
    const [anoLetivo, setAnoLetivo] = useState(initialYearState)            // Constante para armazenamento da ANOLETIVO
    const [classLink, setClassLink] = useState(initialClassLinkState)       // Constante para armazenamento da CLASSLINK

    // --> IDs
    const [subjectID, setEditSubject] = useState(null);                     // Constante para verificar se há edição em DISCIPLINA
    const [tagID, setEditTag] = useState(null);                             // Constante para verificar se há edição em TAG
    
    // --> Montagem
    const [mount, setMount] = useState({
        disciplina: false,
        isMountedSubject: true,
        tag: false,
        isMountedTag: true,
        anoLetivo: false,
        isMountedYear: true,
        classLink: false,
        isMountedClassLink: true
    })

    // =========================================
    // Funções API Fetchs
    // =========================================

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
        let value = response.data.data;
        if (value.length) {
            value[0].dataInicio = new Date(moment(value[0].dataInicio).format("YYYY-MM-DDT07:00:00.000Z"))
            value[0].dataFim = new Date(moment(value[0].dataFim).format("YYYY-MM-DDT07:00:00.000Z"))
            setAnoLetivo(value[0]);
        }
    }

    // Lista CLASS LINK em tela
    async function fetchClassLinkAPI() {
        let response = await api.listarClassLink();
        let value = response.data.data;
        if (value.length) {
            setClassLink(value[0]);
        }
    }

    // =========================================
    // Funções Auxiliares
    // =========================================
    
    // Observa mudanças no conteúdo de listagem - Disciplina
    useEffect(() => {
        const abortController = new AbortController();

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

        // Caso haja mudança em anoLetivo
        if (mount.anoLetivo) {
            if (anoLetivo.dataInicio && anoLetivo.dataFim) {
                getTheWeek();
            }
            setMount(preValue => ({...preValue, anoLetivo: false}));
        }

        // Caso haja mudança em classLink
        if (mount.classLink) {
            fetchClassLinkAPI();
            setMount(preValue => ({...preValue, classLink: false}));
        }

        return abortController.abort();
        // eslint-disable-next-line
    }, [mount])

    // Calcula o número de semanas
    const getTheWeek = () => {
        let count = Math.trunc(anoLetivo.dataInicio.valueOf());
        let week = Math.trunc(((((anoLetivo.dataFim.valueOf() - anoLetivo.dataInicio.valueOf())/1000)/3600)/24)/7);

        setAnoLetivo(preValue => ({
            ...preValue,
            numSemanas: week,
            contagem: count
        }));
    }

    // =========================================
    // Funções de Carregamento Inicial
    // =========================================

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

    // Carregamento Inicial - Class Link
    const initialClassLinkLoad = () => {
        if (mount.isMountedClassLink) {
            fetchClassLinkAPI();
            setMount(preValue => ({...preValue, isMountedClassLink: false}));
        }
    }

    // =========================================
    // Funções HandleChange
    // =========================================

    // Função para pegar os valores do formulário - DISCIPLINA
    const handleSubjectChange = event => {
        const {name, value} = event.target;
        setDisciplina(preValue => ({
            ...preValue,
            [name]: value
        }));
    }

    // Função para pegar os valores do formulário - TAG
    const handleTagChange = event => {
        const {name, value} = event.target;
        setTag(preValue => ({
            ...preValue,
            [name]: value
        }));
    }

    // Função para pegar os valores do formulário - ANO LETIVO
    const handleDateChange = (date, name) => {
        setAnoLetivo(preValue => ({
            ...preValue,
            [name]: date._d
        }));
        setMount(preValue => ({...preValue, anoLetivo: true}));
    };

    // Função para pegar os valores do formulário - CLASSLINK
    const handleClassLinkChange = event => {
        const {name, value} = event.target;
        setClassLink(preValue => ({
            ...preValue,
            [name]: value
        }))
    }

    // =========================================
    // Funções de Salvamento
    // =========================================

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
            .then(window.alert("Ano letivo inserido com sucesso!"))
    }

    // Guarda link da aula no banco
    async function saveClassLinkChange() {
        await api
            .inserirClassLink(classLink)
            .then(window.alert("Link da aula inserido com sucesso!"))
    }

    // =========================================
    // Funções de Edições
    // =========================================

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
            .atualizarAnoLetivo(anoLetivo._id, anoLetivo)
            .then(window.alert("Ano letivo atualizado com sucesso!"))
    }

    // Guarda link da aula atualizado no banco
    async function editClassLinkChange(event) {
        event.preventDefault();

        await api
            .atualizarClassLink(classLink._id, classLink)
            .then(window.alert("Link da aula atualizado com sucesso!"))
    }

    return (
        <MyContainer>
            <GeneralTitle>Configurações</GeneralTitle>

            <section id="gerenciarDisciplina">
                    <Accordion style={{borderBottom: `0.2rem solid #eb7120`}}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            onClick={() => initialSubjectLoad()}
                            aria-controls="panel1a-content"
                            id="panel1-settings">
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
                    <Accordion style={{borderBottom: `0.2rem solid #94c93d`}}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            onClick={() => initialTagLoad()}
                            aria-controls="panel1a-content"
                            id="panel2-settings">
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
                <Accordion style={{borderBottom: `0.2rem solid #a283bc`}}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        onClick={() => initialYearLoad()}
                        aria-controls="panel1a-content"
                        id="panel3-settings">
                        <h2 className="heading-page">Gerenciar Ano Letivo</h2>
                    </AccordionSummary>

                    <AccordionDetails>
                        <Grid container={true} className={classes.root} spacing={2}>
                            <Grid item={true} xs={12} sm={8}>
                                <Grid container={true} className={classes.dateGrid} spacing={1}>
                                    <Grid item={true} xs={12} sm={6}>
                                        <MuiPickersUtilsProvider locale="pt-br" libInstance={moment} utils={MomentUtils}>
                                            <KeyboardDatePicker
                                                id="picker-data-inicio"
                                                autoOk={true}
                                                disableToolbar={true}
                                                variant="inline"
                                                format="DD/MM/YYYY"
                                                margin="normal"
                                                label="Data de Início" 
                                                name="dataInicio"
                                                value={anoLetivo.dataInicio}
                                                inputValue={moment(anoLetivo.dataInicio).format("DD/MM/YYYY")}
                                                onChange={date => handleDateChange(date, "dataInicio")}
                                                rifmFormatter={dateFormatter}
                                                maxDate={anoLetivo.dataFim}
                                                KeyboardButtonProps={{ 'aria-label': 'change date' }}/>
                                        </MuiPickersUtilsProvider>
                                    </Grid>

                                    <Grid item={true} xs={12} sm={6}>
                                        <MuiPickersUtilsProvider locale="pt-br" libInstance={moment} utils={MomentUtils}>
                                            <KeyboardDatePicker
                                                id="picker-data-fim"
                                                autoOk={true}
                                                disableToolbar={true}
                                                variant="inline"
                                                format="DD/MM/YYYY"
                                                margin="normal"
                                                label="Data de Fim"
                                                name="dataFim"
                                                value={anoLetivo.dataFim}
                                                inputValue={moment(anoLetivo.dataFim).format("DD/MM/YYYY")}
                                                onChange={date => handleDateChange(date, "dataFim")}
                                                rifmFormatter={dateFormatter}
                                                minDate={anoLetivo.dataInicio}
                                                KeyboardButtonProps={{ 'aria-label': 'change date' }}/>
                                        </MuiPickersUtilsProvider>
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
                                        onClick={anoLetivo._id ? editYearChange : saveYearChange}>
                                        Salvar
                                    </Button>
                                </div>
                            </Grid>

                            <Grid className={classes.dateGrid} item={true} xs={12} sm={4}>
                                <MyTypography id="yearTitle" variant="h6">Número de Semanas</MyTypography>
                                <MyTypography id="weekTitle" variant="h4">{anoLetivo.numSemanas}</MyTypography>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </section>
        
            <section id="gerenciarClassroom" className={classes.section}>
                <Accordion style={{borderBottom: `0.2rem solid #fdc504`}}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        onClick={() => initialClassLinkLoad()}
                        aria-controls="panel1a-content"
                        id="panel4-settings">
                        <h2 className="heading-page">Gerenciar Aula Online</h2>
                    </AccordionSummary>

                    <AccordionDetails>
                        <Grid container={true} className={classes.root} spacing={2}>
                            <Grid item={true} xs={12}>
                                <Paper component="form" className={classes.classLink}>
                                    <IconButton className={classes.iconButton} disabled={true} aria-label="link">
                                        <InsertLinkIcon />
                                    </IconButton>
                                    <InputBase
                                        className={classes.input}
                                        placeholder="Link para Aula ao vivo"
                                        inputProps={{ 'aria-label': 'link aula online' }}
                                        fullWidth={true}
                                        name="aulaLink"
                                        onChange={handleClassLinkChange}
                                        value={classLink.aulaLink}
                                    />
                                    <Divider className={classes.divider} orientation="vertical" />
                                    <IconButton type="submit" color="primary" className={classes.iconButton} onClick={classLink._id ? editClassLinkChange : saveClassLinkChange} aria-label="search">
                                        <SaveIcon />
                                    </IconButton>
                                </Paper>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </section>

        </MyContainer>
    );
};