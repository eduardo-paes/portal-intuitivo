import React, {useState, useEffect} from 'react';
import api from '../../api';

import { MyContainer, CreateButton, MyTextField, GeneralTitle } from "../../assets/styles/styledComponents";
import { makeStyles, Grid, MenuItem, Button } from "@material-ui/core";
import { ContentTable, PDFPreviewDialog } from '../../components';

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

export default function ContentList () {
  const classes = useStyles();
  const [filter, setFilter] = useState({
    area: "",
    disciplina: {
      id: "",
      nome: ""
    },
    numeracao: ""
  });
  const [listaDisciplina, setListaDisciplina] = useState([  ]);
  const [content, setContent] = useState({ conteudos: [] })
  
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
    const abortController = new AbortController();
    async function fetchDisciplinaAPI() {
      const response = await api.listarDisciplinas();
      const value = response.data.data;
      setListaDisciplina(value);
    }
    fetchDisciplinaAPI()
    return abortController.abort();
  }, []);
  
  // -- Carrega os Tópicos existentes no banco
  useEffect(() => {
    let { area, disciplina, numeracao } = filter;
    let { id } = disciplina;
    const abortController = new AbortController();
    
    if (id === '') id = '000000000000000000000000';
    if (area === '') area = 'area';
    
    async function fetchConteudoAPI() {
      const response = await api.listarConteudoPersonalizado(id, area, numeracao);
      const value = response.data.data;
      setContent({ conteudos: value });
    }
    fetchConteudoAPI();
    return abortController.abort();
    // eslint-disable-next-line
  }, [filter]);

  const array = [];
  for (let i = 1; i < 33; ++i) array[i-1] = i;

  const {conteudos} = content;
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [id, setId] = useState('');

  return (
    <MyContainer>
      <section>
          <Grid container={true} className={classes.root} spacing={3}>
              <Grid item={true} xs={12} sm={12}>
                <GeneralTitle>Conteúdos Disciplinares</GeneralTitle>
              </Grid>
          </Grid>
          <Grid container={true} className={classes.root} spacing={6}>
              {/* -- Filtro -- */}
              <Grid item={true} xs={12} lg={3} sm={3}>
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
              <Grid item={true} xs={12} lg={3} sm={3}>
                <MyTextField
                  id="campoDisciplina"
                  variant="outlined"
                  select={true}
                  label="Disciplina"
                  name="disciplinaID"
                  value={filter.disciplina === undefined ? "" : filter.disciplina.nome}>
                  {
                      listaDisciplina.map((row, index) => {
                          return <MenuItem key={index} value={row.nome} onClick={() => onDisciplineChange("disciplina", row._id, row.nome)}>{row.nome}</MenuItem>
                      })
                  }
                </MyTextField>
              </Grid>
              <Grid item={true} xs={12} lg={3} sm={3}>
                <MyTextField
                  id="filtroNumeracao"
                  className={classes.filter}
                  select={true}
                  label="Numeração"
                  variant="outlined"
                  name="numeracao"
                  type="text"
                  value={filter.numeracao}
                  onChange={onFilterChange}>
                    {
                      array.map((row, index) => {
                        return <MenuItem key={index} value={row}>{row}</MenuItem>
                      })
                    }
                </MyTextField>
              </Grid>
              <Grid item={true} xs={12} lg={3} sm={3}>
                <Grid container={true} className={classes.root} spacing={6}>
                  <Grid item={true} xs={12} lg={12} sm={12}>
                    <Button 
                      color="primary" 
                      variant="outlined"
                      size="large"
                      onClick={() => {
                        setFilter({
                          area: "",
                          disciplina: {
                            id: "",
                            nome: ""
                          },
                          numeracao: ""
                        })
                      }}
                    >Limpar filtro</Button>
                  </Grid>
                </Grid>
              </Grid>

              {/* -- Tabela -- */}
              <Grid item={true} lg={12} sm={12}>
                <ContentTable 
                  data={conteudos} 
                  open={open} 
                  setOpen={setOpen} 
                  setTitulo={setTitulo} 
                  setId={setId}
                />
              </Grid>
          </Grid>
          <Grid item={true} xs={12} sm={12} align="center">
            <CreateButton title="Inserir Conteúdo" url="/controle-conteudo/create"/>
          </Grid>
      </section>

          <PDFPreviewDialog 
            conteudo={`http://localhost:5000/uploads/content/${id}.pdf`}
            topico={titulo}
            open={open}
            setOpen={setOpen}
          />
    </MyContainer>
  );
};