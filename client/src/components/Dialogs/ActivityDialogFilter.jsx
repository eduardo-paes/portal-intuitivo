import React, { useState, useEffect } from 'react';
import { Button,  Dialog , Grid, DialogActions, DialogContent, DialogTitle, MenuItem } from '@material-ui/core';
import { MyTextField } from "../../assets/styles/styledComponents";
import api from '../../api';

const initialFilter = {
  tipo: "",
  disciplinaID: "",
  topico: "",
  numeracao: "",
  area: ""
}

export default function ActivityDialogFilter(props) {
  const { filter, setFilter, open, setOpen, revision, setIsCleaned } = props;
  const [listaDisciplina, setListaDisciplina] = useState([]);
  const [semanasAno, setSemanasAno] = useState(32);
  const [mount, setMount] = useState(true);
  const [tempFilter, setTempFilter] = useState(initialFilter);

  // Carregamentos iniciais
  useEffect(() => {
    const abortController = new AbortController();

    // Verifica se filtro já está preenchido
    if (filter !== initialFilter) {
      setTempFilter(filter);
    } else if (tempFilter !== initialFilter) {
      setTempFilter(initialFilter);
    }

    // Monta disciplinas e ano letivo
    if (mount) {
      async function fetchDisciplinaAPI() {
        const response = await api.listarDisciplinas();
        const value = response.data.data;
        setListaDisciplina(value);
      }
  
      async function fetchAnoLetivoAPI() {
        const response = await api.listarAnoLetivo();
        const value = response.data.data;
        setSemanasAno(value[0].numSemanas);
      }
  
      // Faz o fetch e desmonta
      fetchDisciplinaAPI();
      fetchAnoLetivoAPI();
      setMount(false);
    }

    return abortController.abort();
    // eslint-disable-next-line
  }, [filter]);

  // Salva modificações do filtro temporariamente
  const onFilterChange = (event) => {
    const { name, value } = event.target;
    setTempFilter(preValue => ({
      ...preValue,
      [name]: value
    }))
    setIsCleaned(false);
  }

  // Salva modificações no filtro permanentemente
  const onSubmit = () => {
    setFilter(tempFilter);
    setOpen(false);
  };

  // Array com o número de semanas
  const array = [];
  for (let i = 1; i <= semanasAno; ++i) array[i-1] = i;

  return (
    <Dialog open={open} fullWidth={true} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Filtro</DialogTitle>

      <DialogContent>
        <Grid container={true} spacing={2}>

          <Grid item={true} xs={12}>
            <MyTextField
              id="campoArea"
              variant="outlined"
              disabled={false}
              select={true}
              label="Área do Conhecimento"
              name="area"
              value={tempFilter.area ? tempFilter.area : ""}
              onChange={onFilterChange}>
                <MenuItem value="Ciências Humanas">Ciências Humanas</MenuItem>
                <MenuItem value="Ciências da Natureza">Ciências da Natureza</MenuItem>
                <MenuItem value="Linguagens">Linguagens</MenuItem>
                <MenuItem value="Matemática">Matemática</MenuItem>
            </MyTextField>
          </Grid>

          <Grid item={true} hidden={revision} xs={12}>
            <MyTextField
              id="campoTipo"
              variant="outlined"
              select={true}
              label="Tipo de Atividade"
              name="tipo"
              value={tempFilter.tipo ? tempFilter.tipo : ""}
              onChange={onFilterChange}>
                <MenuItem value="Nenhum">Nenhum</MenuItem>
                <MenuItem value="Fixação">Fixação</MenuItem>
                <MenuItem value="Retomada">Retomada</MenuItem>
                <MenuItem value="Aprofundamento">Aprofundamento</MenuItem>
                <MenuItem value="Avaliação Diagnóstica">Avaliação Diagnóstica</MenuItem>
            </MyTextField>
          </Grid>

          <Grid item={true} hidden={revision} xs={12}>
            <MyTextField
              id="campoDisciplina"
              variant="outlined"
              select={true}
              label="Disciplina"
              name="disciplinaID"
              value={tempFilter.disciplinaID ? tempFilter.disciplinaID : ""}
              onChange={onFilterChange}>
              {
                listaDisciplina.map((row, index) => {
                  return <MenuItem key={index} value={row._id}>{row.nome}</MenuItem>
                })
              }
            </MyTextField>
          </Grid>

          <Grid item={true} hidden={revision} xs={12}>
            <MyTextField
              id="campoDisciplina"
              variant="outlined"
              label="Tópico"
              name="topico"
              value={tempFilter.topico ? tempFilter.topico : ""}
              onChange={onFilterChange}/>
          </Grid>

          <Grid item={true} hidden={!revision} xs={12}>
            <MyTextField
              id="filtroNumeracao"
              select={true}
              label="Numeração"
              variant="outlined"
              name="numeracao"
              value={tempFilter.numeracao ? tempFilter.numeracao : ""}
              onChange={onFilterChange}>
                {
                  array.map((row, index) => {
                    return <MenuItem key={index} value={row}>{row}</MenuItem>
                  })
                }
            </MyTextField>
          </Grid>

        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="primary">
          Voltar
        </Button>
        <Button onClick={onSubmit} color="primary">
          Filtrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}