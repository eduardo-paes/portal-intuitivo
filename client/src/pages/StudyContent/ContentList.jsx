import React, {useState, useEffect} from 'react';
import api from '../../api';

import { MyContainer, CreateButton, MyTextField } from "../../assets/styles/styledComponents";
import { Grid, MenuItem, Button } from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';
import { ContentTable } from '../../components';
import { Link } from 'react-router-dom';
// import {TextEditor} from "../../components"

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
  filter: {
    width: "80%",
    height: "10px"
  }
}));

function ContentList () {

  const [ filter, setFilter ] = useState({
    area: "",
    disciplina: {
      id: "",
      nome: ""
    },
    numeracao: ""
  });
  const [ listaDisciplina, setListaDisciplina ] = useState([  ]);
  
  const classes = useStyles();

  const [content, setContent] = useState({
    conteudos: []
  })
  
  function onFilterChange (event) {
    const { name, value } = event.target;
    setFilter (preValue => ({
      ...preValue,
      [name]: value
    }))
  }

  function onDisciplineChange (nameField, ID, nome) {
    setFilter(preValue => ({
      ...preValue,
      [nameField]: {
        id: ID,
        nome: nome
      }
    }));
  };

  // -- Carrega as Disciplinas existentes no banco
  useEffect(() => {
    let unmounted = false;
    async function fetchDisciplinaAPI() {
      const response = await api.listarDisciplinas();
      const value = response.data.data;
      if (!unmounted) {
        setListaDisciplina(value);
      }  
    }
    fetchDisciplinaAPI()
    return () => {unmounted = true};
  }, []);
  
  useEffect(() => {
    let unmounted = false;
    async function fetchAPI () {
      let response = await api.listarConteudos();
      if (!unmounted) {
        setContent({ conteudos: response.data.data })
      }
    }
    fetchAPI();
    return () => {unmounted = true};
  }, []);
  
  const {conteudos} = content;

  return (
    <MyContainer>
      <header>
          <Grid container={true} className={classes.root} spacing={2}>
              <Grid item={true} xs={12} sm={9}>
                  <h1 className="heading-page">Conteúdos Disciplinares</h1>
              </Grid>

              <Grid item={true} xs={12} sm={3}>
                  <CreateButton title="Inserir Conteúdo" url="/controle-conteudo/create"/>
              </Grid>

              <Grid item={true} xs={3} sm={3}>
                <MyTextField
                  id="campoArea"
                  variant="outlined"
                  disabled={false}
                  select={true}
                  label="Área do Conhecimento"
                  name="area"
                  value={filter.area ? filter.area : ""}
                  onChange={onFilterChange}>
                    <MenuItem value="Ciências Humanas">Ciências Humanas</MenuItem>
                    <MenuItem value="Ciências da Natureza">Ciências da Natureza</MenuItem>
                    <MenuItem value="Linguagens">Linguagens</MenuItem>
                    <MenuItem value="Matemática">Matemática</MenuItem>
                </MyTextField>
              </Grid>
              <Grid item={true} xs={3} sm={3}>
                <MyTextField
                  id="campoDisciplina"
                  variant="outlined"
                  select={true}
                  label="Disciplina"
                  name="disciplinaID"
                  autoFocus={true}
                  value={filter.disciplina === undefined ? "" : filter.disciplina.nome}>
                  {
                      listaDisciplina.map((row, index) => {
                          return <MenuItem key={index} value={row.nome} onClick={() => onDisciplineChange("disciplina", row._id, row.nome)}>{row.nome}</MenuItem>
                      })
                  }
                </MyTextField>
              </Grid>
              <Grid item={true} xs={3} sm={3}>
                <MyTextField
                  id="filtroNumeracao"
                  className={classes.filter}
                  label="Numeração"
                  variant="outlined"
                  name="numeracao"
                  type="text"
                  value={filter.numeracao}
                  onChange={onFilterChange}/>
              </Grid>
              <Grid item={true} xs={3} sm={3}>
                <Link to="/controle-conteudo/?numeracao=1">
                  <Button color="primary" variant="outlined">Filtrar</Button>
                </Link>
              </Grid>

              <Grid item={true} xs={12} sm={12}>
                <ContentTable data={conteudos}/>
              </Grid>
          </Grid>
      </header>
    </MyContainer>
  );
};

export default ContentList;
