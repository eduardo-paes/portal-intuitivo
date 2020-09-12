import React, { useState, useEffect } from "react";
import { makeStyles, useTheme, Grid, MenuItem, Tooltip, Zoom, Fab, Grow } from "@material-ui/core";
import { MyContainer, MyTextField } from "../../assets/styles/styledComponents"
import ContentAccordion from "../../components/Accordions/ContentAccordion";

import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import ClearAllIcon from '@material-ui/icons/ClearAll';
import api from '../../api';

const useStyles = makeStyles((theme) => ({
  filterText: {
    margin: "0", 
    alignContent: "flex-end",
    alignSelf: "center",
  },
  filterFab: {
    display: "flex",
    justifyContent: "center",
  }
}));

function Library (props) {
  const classes = useStyles();
  const theme = useTheme();

  const [filter, setFilter] = useState({ topico: "", disciplina: "", numeracao: "" });
  const [listaDisciplina, setListaDisciplina] = useState([]);
  const [listaConteudo, setListaConteudo] = useState([]);
  const [numeracao, setNumeracao] = useState([]);
  const [backupConteudo, setBackupConteudo] = useState([]);

  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  // -- Carrega as Disciplinas existentes no banco
  useEffect(() => {
    const abortController = new AbortController();
    // Preenche constante de numeração
    for (let i = 1; i < 33; ++i) { setNumeracao(preValue => ([ ...preValue, i ])) }

    // Lista Disciplina
    async function fetchDisciplinaAPI() {
      const response = await api.listarDisciplinas();
      const value = response.data.data;
      setListaDisciplina(value);
    }
    fetchDisciplinaAPI();

    // Lista Conteúdo
    async function fetchConteudoAPI() {
      const response = await api.listarConteudos();
      setListaConteudo(response.data.data);
      setBackupConteudo(response.data.data);
    }
    fetchConteudoAPI();
    return abortController.abort();
  }, []);

  // -- Carrega o Conteúdo existente no banco
  useEffect(() => {
    const abortController = new AbortController();
    let { topico, disciplina, numeracao } = filter;

    if (disciplina !== '') {
      setListaConteudo(listaConteudo.filter(content => {
        return content.disciplina.id === disciplina;
      }));
    }

    if (numeracao !== '') {
      setListaConteudo(listaConteudo.filter(content => {
        return content.numeracao === numeracao;
      }));
    }

    if (topico !== '') {
      setListaConteudo(listaConteudo.filter(content => {
        return content.topico.includes(topico);
      }));
    }

    return abortController.abort();
    // eslint-disable-next-line
  }, [filter]);

  function onFilterChange (event) {
    const { name, value } = event.target;
    setFilter (preValue => ({
      ...preValue,
      [name]: value
    }))
  }

  function clearFilter () {
    setListaConteudo(backupConteudo);
    setFilter({ area: "", disciplina: "", numeracao: "" });
  }

  function ListarConteudo() {
    if (listaConteudo.length > 0) {
      return listaConteudo.map((row, index) => {
        console.log(listaConteudo);
        return (
          <Grid key={index} item={true} xs={12} lg={12} sm={12}>
            <ContentAccordion id={row._id} topico={row.topico} disciplina={row.disciplina}/>
          </Grid>
        )
      })
    }
  }

  return (
    <MyContainer>
      <section id="libraryHeader">
        <h1 className="heading-page">Biblioteca</h1>
        <h2 className="subtitle-page ">Conteúdo Disponível</h2>
      </section>

      <section id="libraryFilter">
        <Grid container={true} justify="center">

          <Grid item={true} xs={12} sm={2}>
            <FormControlLabel
              control={<Switch checked={checked} onChange={handleChange} />}
              label="Filtro"
            />
          </Grid>

            <Grid item={true} xs={12} sm={10}>
              <Grid container={true} justify="flex-end" spacing={1}>
              
                <Grow in={checked}>
                  <Grid item={true} xs={12} lg={4} sm={4}>
                    <MyTextField
                      id="campoDisciplina"
                      variant="outlined"
                      label="Tópico"
                      name="topico"
                      className={classes.filterText}
                      value={filter.topico === undefined ? "" : filter.topico}
                      onChange={onFilterChange}/>
                  </Grid>
                </Grow>

                <Grow in={checked}>
                  <Grid item={true} xs={12} lg={4} sm={4}>
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
                  </Grid>
                </Grow>

                <Grow in={checked}>
                  <Grid item={true} xs={12} lg={3} sm={3}>
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
                  </Grid>
                </Grow>
                
                <Grow in={checked}>
                  <Grid item={true} className={classes.filterFab} xs={12} lg={1} sm={1}>
                    <Zoom
                      timeout={transitionDuration}
                      in={true}
                      style={{ transitionDelay: "0ms" }}
                      unmountOnExit={true}
                    >
                      <Tooltip title="Limpar">
                        <Fab color="primary" justify="flex-end" aria-label="add" onClick={() => clearFilter()}>
                          <ClearAllIcon />
                        </Fab>
                      </Tooltip>
                    </Zoom>
                  </Grid>
                </Grow>
              
              </Grid>
            </Grid>
        
        </Grid>
      </section>

      <section id="libraryMain">
        <Grid container={true} spacing={2}>
          { ListarConteudo() }
        </Grid>
      </section>

      <section id="libraryFooter">

      </section>
    </MyContainer>
  );
};

export default Library;
