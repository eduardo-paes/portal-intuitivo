import React, { useState, useEffect } from 'react';
import { Button,  Dialog , Grid, DialogActions, DialogContent, DialogTitle, MenuItem } from '@material-ui/core';
import { MyTextField } from "../../assets/styles/styledComponents";
import api from '../../api';

const initialFilter = {
  disciplinaID: "",
  topicoID: "",
  tipo: "",
  tags: "",
}

export default function ActivityDialogFilter(props) {
  const { filter, setFilter, open, setOpen, activity } = props;

  const [listaDisciplina, setListaDisciplina] = useState([]);
  const [listaTopico, setListaTopico] = useState([]);
  const [listaTag, setListaTag] = useState([]);

  const [mount, setMount] = useState(true);
  const [isRevision, setRevision] = useState(false);
  const [tempFilter, setTempFilter] = useState(initialFilter);

  // Disciplina
  async function fetchDisciplinaAPI() {
    const response = await api.listarDisciplinas();
    const value = response.data.data;
    setListaDisciplina(value);
  }

  // Tópico
  async function fetchTopicoAPI() {
    if (tempFilter.disciplinaID !== "") {
      const response = await api.listarConteudoPorDisciplina(tempFilter.disciplinaID)
      const value = response.data.data;
      setListaTopico(value);
    }
  }

  // Tags
  async function fetchTagAPI() {
    if (tempFilter.disciplinaID !== "") {
      const response = await api.listarTagsPorDisciplina(tempFilter.disciplinaID)
      const value = response.data.data;
      setListaTag(value);
    }
  }

  useEffect(() => {
    const abortController = new AbortController();
    fetchTopicoAPI();
    fetchTagAPI();
    return abortController.abort();
  }, [tempFilter.disciplinaID])

  // Carregamentos iniciais
  useEffect(() => {
    const abortController = new AbortController();

    // Verifica se filtro já está preenchido
    if (filter !== initialFilter) {
      setTempFilter(filter);
    } else if (tempFilter !== initialFilter) {
      setTempFilter(initialFilter);
    }

    // Ca
    if (activity !== false) {
      setTempFilter(preValue => ({
        ...preValue,
        disciplinaID: activity.disciplinaID !== '' ? activity.disciplinaID : '',
        topicoID: activity.topicoID !== '' ? activity.topicoID : '',
      }))
    }

    // Montagem das listas
    if (mount) {
      // Faz o fetch e desmonta
      fetchDisciplinaAPI();
      setMount(false);
    }

    return abortController.abort();
    // eslint-disable-next-line
  }, [filter]);

  // Caso seja uma atividade, já preenche os dados pré-existentes
  useEffect(() => {
    const abortController = new AbortController();
    
    if (activity !== false) {
      setTempFilter(preValue => ({
        ...preValue,
        disciplinaID: activity.disciplinaID !== '' ? activity.disciplinaID : '',
        topicoID: activity.topicoID !== '' ? activity.topicoID : '',
      }))

      if (activity.tipoAtividade === "Avaliação Diagnóstica") {
        setRevision(true);
      } else {
        setRevision(false);
      }
    }

    return abortController.abort();
    // eslint-disable-next-line
  }, [activity])

  // Salva modificações do filtro temporariamente
  const onFilterChange = (event) => {
    const { name, value } = event.target;
    setTempFilter(preValue => ({
      ...preValue,
      [name]: value
    }))
  }

  // Salva modificações no filtro permanentemente
  const onSubmit = () => {
    setFilter(tempFilter);
    setOpen(false);
  };

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
              label="Tipo de Questão"
              name="tipo"
              value={tempFilter.tipo ? tempFilter.tipo : ""}
              onChange={onFilterChange}>
                <MenuItem value="discursiva">Discursiva</MenuItem>
                <MenuItem value="multiplaEscolha">Múltipla Escolha</MenuItem>
            </MyTextField>
          </Grid>

          <Grid item={true} hidden={!isRevision} xs={12}>
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

          <Grid item={true} hidden={!isRevision} xs={12}>
            <MyTextField
              id="campoDisciplina"
              variant="outlined"
              select={true}
              disabled={tempFilter.disciplinaID === '' ? true : false}
              label="Tópico"
              name="topicoID"
              value={tempFilter.topicoID ? tempFilter.topicoID : ""}
              onChange={onFilterChange}>
              {
                listaTopico.map((row, index) => {
                  return <MenuItem key={index} value={row._id}>{row.topico}</MenuItem>
                })
              }
            </MyTextField>
          </Grid>

          <Grid item={true} xs={12}>
            <MyTextField
              id="campoDisciplina"
              variant="outlined"
              select={true}
              disabled={tempFilter.disciplinaID === '' ? true : false}
              label="Tags"
              name="tags"
              value={tempFilter.tags ? tempFilter.tags : ""}
              onChange={onFilterChange}>
              {
                listaTag.map((row, index) => {
                  return <MenuItem key={index} value={row.nome}>{row.nome}</MenuItem>
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