import React, { useState, useEffect } from "react";

// -- Material UI
import { makeStyles, useMediaQuery, useTheme, Grid, MenuItem, Tooltip, Typography, Fab, Fade } from "@material-ui/core";
import ClearAllIcon from '@material-ui/icons/ClearAll';

// -- Local Components
import { GeneralSubtitle, GeneralTitle, MyContainer, MyTextField } from "../../assets/styles/styledComponents"
import { ContentAccordion, AccordionSkeleton } from "../../components";

// -- External Functions
import { currentWeek } from "../../utils";
import api from '../../api';

const useStyles = makeStyles((theme) => ({
  filterText: {
    margin: "0", 
    alignContent: "flex-end",
    alignSelf: "center",
  },
  filterFab: {
    display: "flex",
    justifyContent: "flex-end",
  },
  smFilterFab: {
    marginTop: "0.5rem",
  },
  smLeftFilterFab: {
    display: "flex",
    justifyContent: "flex-end",
  },
  smRightFilterFab: {
    display: "flex",
    justifyContent: "flex-start",
  },
  libraryMain: {
    marginTop: "1rem",
  }, 
  notFoundMsg1: {
    fontSize: '1.5rem',
  },
  notFoundMsg2: {
    fontSize: '1rem',
  }
}));

export default function Library (props) {
  const classes = useStyles();
  const theme = useTheme();
  const [filter, setFilter] = useState({ topico: 0, disciplina: 0, numeracao: 0 });
  const [listaDisciplina, setListaDisciplina] = useState([]);
  const [listaConteudo, setListaConteudo] = useState([]);
  const [numeracao, setNumeracao] = useState([]);
  const smScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [isLoaded, setIsLoaded] = useState(false);
  const [filterChanged, setFilterChanged] = useState(false);

  // Preenche constante de numeração de acordo com o número de semanas do ano letivo
  async function getCurrentWeek() {
    const numSemanas = await currentWeek();
    for (let i = 1; i <= numSemanas; ++i) { setNumeracao(preValue => ([ ...preValue, i ])) }
    setFilter(preValue => ({
      ...preValue,
      numeracao: numSemanas
    }));
  }

  // Lista Disciplina
  async function fetchDisciplinaAPI() {
    const response = await api.listarDisciplinas();
    setListaDisciplina(response.data.data);
  }

  // Lista Conteúdo
  async function fetchConteudoAPI() {
    const { numeracao, disciplina, topico } = filter;
    const response = await api.listarConteudoPorFiltro(numeracao, disciplina, topico);
    const value = response.data;
    if (value.success) {
      setListaConteudo(value.data);
    }
    setIsLoaded(true);
  }

  // -- Carrega Disciplinas/Número de Semanas
  useEffect(() => {
    const abortController = new AbortController();
    getCurrentWeek();
    fetchDisciplinaAPI();
    return abortController.abort();
  }, []);

  // -- Carrega Conteúdo de acordo com semana atual
  useEffect(() => {
    const abortController = new AbortController();
    fetchConteudoAPI();
    return abortController.abort();
    // eslint-disable-next-line
  }, [filter])

  // -- Ao alterar qualquer valor do filtro
  function onFilterChange (event) {
    const { name, value } = event.target;
    setFilterChanged(true);
    setFilter (preValue => ({
      ...preValue,
      [name]: value
    }))
  }

  // -- Limpa o filtro
  function clearFilter() {
    setFilterChanged(false);
    setFilter({ topico: 0, disciplina: 0, numeracao: 0 });
  }

  // -- Lista os conteúdos
  function returnContent() {
    if (isLoaded) {
      if (!listaConteudo.length) {
        return (
          <Grid item={true}>
            <Typography className={classes.notFoundMsg1}>Nenhum conteúdo encontrado.</Typography>
            <Typography className={classes.notFoundMsg2}>Tente reajustar o filtro acima para mais conteúdo.</Typography>
          </Grid>
        )
      }
      return listaConteudo.map((row, index) => {
        const { _id, topico, disciplinaID, numeracao, videoAulaURL } = row;
          return (
            <Grid key={index} item={true} xs={12} lg={12} sm={12}>
              <ContentAccordion 
                topicoID={_id} 
                disciplinaNome={disciplinaID.nome} 
                titulo={topico} 
                semana={numeracao}
                tipoAcordeao="biblioteca"
                linkAula={videoAulaURL}/>
            </Grid>
          )
      })
    } else {
      return AccordionSkeleton(4);
    }
  }

  return (
    <MyContainer id="studentPageContainer">
      <section id="libraryHeader">
        <Grid container={true} spacing={2}>
          <Grid item={true} xs={12} sm={12}>
            <GeneralTitle id="libraryTitle">Biblioteca</GeneralTitle>
          </Grid>

          <Grid item={true} xs={12} sm={12}>
            <GeneralSubtitle id="librarySubTitle">Conteúdo Disponível</GeneralSubtitle>
          </Grid>
        </Grid>
      </section>

      <section id="libraryFilter">
        <Grid container={true} style={{marginTop: "1rem"}} justify={"center"}>

          <Grid item={true} xs={12} sm={filterChanged ? 11 : 12}>
            <Grid container={true} justify="flex-start" spacing={1}>

              <Grid item={true} xs={12} lg={4} sm={4}>
                <Fade in={true} style={{transitionDelay: '250ms'}}>
                  <MyTextField
                    id="campoDisciplina"
                    variant="outlined"
                    label="Tópico"
                    name="topico"
                    className={classes.filterText}
                    value={filter.topico ? filter.topico : ''}
                    onChange={onFilterChange}/>
                </Fade>
              </Grid>
              <Grid item={true} xs={12} lg={4} sm={4}>
                <Fade in={true} style={{transitionDelay: '250ms'}}>
                  <MyTextField
                    id="campoDisciplina"
                    variant="outlined"
                    select={true}
                    label="Disciplina"
                    name="disciplina"
                    className={classes.filterText}
                    value={filter.disciplina ? filter.disciplina : ''}
                    onChange={onFilterChange}>
                    {
                      listaDisciplina.map((row, index) => {
                        return <MenuItem key={index} value={row._id}>{row.nome}</MenuItem>
                      })
                    }
                  </MyTextField>
                </Fade>
              </Grid>
              <Grid item={true} xs={12} lg={4} sm={4}>
                <Fade in={true} style={{transitionDelay: '250ms'}}>
                  <MyTextField
                    id="filtroNumeracao"
                    select={true}
                    label="Semana"
                    variant="outlined"
                    name="numeracao"
                    type="text"
                    className={classes.filter}
                    value={filter.numeracao ? filter.numeracao : ''}
                    onChange={onFilterChange}>
                      {
                        numeracao.map((row, index) => {
                          return <MenuItem key={index} value={row}>{row}</MenuItem>
                        })
                      }
                  </MyTextField>
                </Fade>
              </Grid>
              
            </Grid>
          </Grid>

          <Grid item={true} xs={12} sm={filterChanged ? 1 : false} className={smScreen ? classes.smFilterFab : 'none'} hidden={!filterChanged} align="center">
            <Fade
              in={filterChanged}
              style={{ transformOrigin: '0 0 0' }}
              {...({ timeout: 1000 })}
            >
                <Tooltip title="Limpar">
                  <Fab color="secondary" justify="flex-end" aria-label="clear" onClick={() => clearFilter()}>
                    <ClearAllIcon />
                  </Fab>
                </Tooltip>
            </Fade>
          </Grid>

        </Grid>
      </section>

      <section id="libraryMain">
        <Grid container={true} spacing={2} className={classes.libraryMain}>
          { returnContent() }
        </Grid>
      </section>
    </MyContainer>
  );
};
