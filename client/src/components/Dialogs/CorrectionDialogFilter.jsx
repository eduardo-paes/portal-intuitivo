import React, { useState, useEffect } from 'react';
import { Button,  Dialog , Grid, DialogActions, DialogContent, DialogTitle, MenuItem } from '@material-ui/core';
import { MyTextField } from "../../assets/styles/styledComponents";
import api from '../../api';

const initialFilter = {
  numeracao: '',
  disciplina: '',
  topico: '',
  tipo: '',
  aluno:''
}

export default function CorrectionDialogFilter(props) {
  const { filter, setFilter, open, setOpen, setIsCleaned, essay } = props;
  const [listaDisciplina, setListaDisciplina] = useState([]);
  const [semanasAno, setSemanasAno] = useState(0);
  const [mount, setMount] = useState(true);
  const [tempFilter, setTempFilter] = useState(initialFilter);
  const [arrayAno, setArrayAno] = useState([1]);

  // -- Carregamentos iniciais
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

  // -- Array com o número de semanas
  useEffect(() => {
    const abortController = new AbortController();
    if (semanasAno) {
      const array = [];
      for (let i = 1; i < semanasAno; ++i) array[i-1] = i;
      setArrayAno(array);
    }
    return abortController.abort();
    // eslint-disable-next-line
  }, [semanasAno]);

  // -- Ajusta campos do filtro de caso sejam listadas redações
  useEffect(() => {
    const abortController = new AbortController();
    var field = '';

    if (essay)  field = 'tipo';
    else field = 'aluno';

    setTempFilter(preValue => ({
      ...preValue,
      [field]: ''
    }));

    return abortController.abort();
    // eslint-disable-next-line
  }, [essay])

  // -- Salva modificações do filtro temporariamente
  const onFilterChange = (event) => {
    const { name, value } = event.target;
    setTempFilter(preValue => ({
      ...preValue,
      [name]: value
    }))
    setIsCleaned(false);
  }

  // -- Salva modificações no filtro permanentemente
  const onSubmit = () => {
    setFilter(tempFilter);
    setOpen(false);
  };

  return (
    <Dialog open={open} fullWidth={true} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Filtro</DialogTitle>

      <DialogContent>
        <Grid container={true} spacing={2}>

          <Grid id="numeracaoGrid" item={true} xs={12}>
            <MyTextField
              id="filtroNumeracao"
              select={true}
              label="Numeração"
              variant="outlined"
              name="numeracao"
              value={tempFilter.numeracao ? tempFilter.numeracao : ""}
              onChange={onFilterChange}>
                {
                  arrayAno.map((row, index) => {
                    return <MenuItem key={index} value={row}>{row}</MenuItem>
                  })
                }
            </MyTextField>
          </Grid>

          <Grid id="tipoGrid" item={true} xs={12} hidden={essay ? true : false}>
            <MyTextField
              id="campoTipo"
              variant="outlined"
              select={true}
              label="Tipo de Atividade"
              name="tipo"
              value={tempFilter.tipo ? tempFilter.tipo : ""}
              onChange={onFilterChange}>
                <MenuItem value="Fixação">Fixação</MenuItem>
                <MenuItem value="Retomada">Retomada</MenuItem>
                <MenuItem value="Aprofundamento">Aprofundamento</MenuItem>
                <MenuItem value="Avaliação Diagnóstica">Avaliação Diagnóstica</MenuItem>
            </MyTextField>
          </Grid>

          <Grid id="disciplinaGrid" item={true} xs={12}>
            <MyTextField
              id="campoDisciplina"
              variant="outlined"
              select={true}
              label="Disciplina"
              name="disciplina"
              value={tempFilter.disciplina ? tempFilter.disciplina : ""}
              onChange={onFilterChange}>
              {
                listaDisciplina.map((row, index) => {
                  return <MenuItem key={index} value={row._id}>{row.nome}</MenuItem>
                })
              }
            </MyTextField>
          </Grid>

          <Grid id="topicoGrid" item={true} xs={12}>
            <MyTextField
              id="campoTopico"
              variant="outlined"
              label="Tópico"
              name="topico"
              value={tempFilter.topico ? tempFilter.topico : ""}
              onChange={onFilterChange}/>
          </Grid>

          <Grid id="alunoGrid" hidden={essay ? false : true} item={true} xs={12}>
            <MyTextField
              id="campoAluno"
              variant="outlined"
              label="Aluno"
              name="aluno"
              value={tempFilter.aluno ? tempFilter.aluno : ""}
              onChange={onFilterChange}/>
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