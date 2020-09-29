import React, { useState, useEffect } from "react";
import { makeStyles, useMediaQuery, useTheme, Grid, MenuItem, Tooltip, Fab, Grow } from "@material-ui/core";
import { GeneralSubtitle, GeneralTitle, MyContainer, MyTextField } from "../../assets/styles/styledComponents"
import { LibraryAccordion } from "../../components";
import ClearAllIcon from '@material-ui/icons/ClearAll';
import FilterListIcon from '@material-ui/icons/FilterList';
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
  }
}));

function Library (props) {
  const classes = useStyles();
  const theme = useTheme();
  const [filter, setFilter] = useState({ topico: "", disciplina: "", numeracao: "" });
  const [listaDisciplina, setListaDisciplina] = useState([]);
  const [listaConteudo, setListaConteudo] = useState([]);
  const [numeracao, setNumeracao] = useState([]);
  const [checked, setChecked] = useState(false);
  const smScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // -- Carrega as Disciplinas existentes no banco
  useEffect(() => {
    const abortController = new AbortController();
    // Preenche constante de numeração
    for (let i = 1; i < 33; ++i) { setNumeracao(preValue => ([ ...preValue, i ])) }

    // Lista Disciplina
    async function fetchDisciplinaAPI() {
      const response = await api.listarDisciplinas();
      setListaDisciplina(response.data.data);
    }

    // Lista Conteúdo
    async function fetchConteudoAPI() {
      const response = await api.listarConteudos();
      setListaConteudo(response.data.data);
    }

    // Fetchs
    fetchDisciplinaAPI();
    fetchConteudoAPI();

    return abortController.abort();
  }, []);

  // -- Ao clicar em Filtro
  function onCheck() {
    setChecked((prev) => !prev); 
    clearFilter();
  }

  // -- Ao alterar qualquer valor do filtro
  function onFilterChange (event) {
    const { name, value } = event.target;
    setFilter (preValue => ({
      ...preValue,
      [name]: value
    }))
  }

  // -- Limpa o filtro
  function clearFilter() {
    setFilter({ topico: "", disciplina: "", numeracao: "" });
  }

  // -- Lista os conteúdos
  function ListarConteudo() {
    if (listaConteudo.length > 0) {
      return listaConteudo.map((row, index) => {
        const { _id, topico, disciplinaID, numeracao, videoAulaURL } = row;

        let auxTopic = (topico.includes(filter.topico) || filter.topico === '') ? true : false;
        let auxSubject = (disciplinaID === filter.disciplina || filter.disciplina === '') ? true : false;
        let auxWeek = (numeracao === filter.numeracao || filter.numeracao === '') ? true : false;

        if (auxTopic && auxSubject && auxWeek) {
          return (
            <Grid key={index} item={true} xs={12} lg={12} sm={12}>
              <LibraryAccordion topicoID={_id} disciplinaNome={disciplinaID.nome} titulo={topico} semana={numeracao} linkAula={videoAulaURL}/>
            </Grid>
          )
        }
        // eslint-disable-next-line
        return;
      })
    }
  }

  return (
    <MyContainer>
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
        <Grid container={true} style={{marginTop: "1rem"}} justify={checked ? "center" : "flex-end"}>

          <Grid item={true} hidden={!checked} xs={12} sm={10}>
            <Grid container={true} justify="flex-start" spacing={1}>

              <Grid item={true} xs={12} lg={4} sm={4}>
                <Grow
                  in={checked}
                  style={{ transformOrigin: '0 0 0' }}
                  {...(checked ? { timeout: 1000 } : {})}
                >
                  <MyTextField
                    id="campoDisciplina"
                    variant="outlined"
                    label="Tópico"
                    name="topico"
                    className={classes.filterText}
                    value={filter.topico === undefined ? "" : filter.topico}
                    onChange={onFilterChange}/>
                </Grow>
              </Grid>
              <Grid item={true} xs={12} lg={4} sm={4}>
                <Grow
                  in={checked}
                  style={{ transformOrigin: '0 0 0' }}
                  {...(checked ? { timeout: 1000 } : {})}
                >
                  <MyTextField
                    id="campoDisciplina"
                    variant="outlined"
                    select={true}
                    label="Disciplina"
                    name="disciplina"
                    className={classes.filterText}
                    value={filter.disciplina === undefined ? "" : filter.disciplina}
                    onChange={onFilterChange}>
                    {
                      listaDisciplina.map((row, index) => {
                        return <MenuItem key={index} value={row._id}>{row.nome}</MenuItem>
                      })
                    }
                  </MyTextField>
                </Grow>
              </Grid>
              <Grid item={true} xs={12} lg={4} sm={4}>
                <Grow
                  in={checked}
                  style={{ transformOrigin: '0 0 0' }}
                  {...(checked ? { timeout: 1000 } : {})}
                >
                  <MyTextField
                    id="filtroNumeracao"
                    select={true}
                    label="Semana"
                    variant="outlined"
                    name="numeracao"
                    type="text"
                    className={classes.filter}
                    value={filter.numeracao}
                    onChange={onFilterChange}>
                      {
                        numeracao.map((row, index) => {
                          return <MenuItem key={index} value={row}>{row}</MenuItem>
                        })
                      }
                  </MyTextField>
                </Grow>
              </Grid>
              
            </Grid>
          </Grid>

          <Grid item={true} xs={12} sm={2}>
            <Grid container={true} className={smScreen ? classes.smFilterFab : 'none'} justify="center" spacing={smScreen ? 1 : 0}>

              <Grid item={true} xs={6} sm={6} className={smScreen ? classes.smLeftFilterFab : classes.filterFab}>
                <Grow
                  in={checked}
                  style={{ transformOrigin: '0 0 0' }}
                  {...(checked ? { timeout: 1000 } : {})}
                  hidden={!checked}
                >
                    <Tooltip title="Limpar">
                      <Fab color="secondary" justify="flex-end" aria-label="clear" onClick={() => clearFilter()}>
                        <ClearAllIcon />
                      </Fab>
                    </Tooltip>
                </Grow>
              </Grid>
              <Grid item={true} xs={6} sm={6} className={(smScreen && checked) ? classes.smRightFilterFab : classes.filterFab}>
                <Grow
                  in={true}
                  style={{ transformOrigin: '0 0 0' }}
                  {...(true ? { timeout: 1000 } : {})}
                >
                  <Tooltip title="Filtrar">
                    <Fab color="primary" justify="flex-start" aria-label="filter" onClick={() => onCheck()}>
                      <FilterListIcon />
                    </Fab>
                  </Tooltip>
                </Grow>
              </Grid>
            
            </Grid>
          </Grid>

        </Grid>
      </section>

      <section id="libraryMain">
        <Grid container={true} spacing={2} className={classes.libraryMain}>
          { ListarConteudo() }
        </Grid>
      </section>
    </MyContainer>
  );
};

export default Library;
