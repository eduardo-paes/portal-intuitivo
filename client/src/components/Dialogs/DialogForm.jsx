import React, { useState, useEffect } from 'react';
import { Button,  Dialog , Grid, DialogActions, DialogContent, DialogTitle, MenuItem } from '@material-ui/core';
import { MyTextField } from "../../assets/styles/styledComponents";
import api from '../../api';

export default function FormDialog(props) {
  const { filter, setFilter, open, setOpen } = props;
  const [listaDisciplina, setListaDisciplina] = useState([]);
  const [tempFilter, setTempFilter] = useState({
    area: "",
    disciplinaID: "",
    numeracao: ""
  });

  // -- Carrega as Disciplinas existentes no banco
  useEffect(() => {
    const abortController = new AbortController();

    if (filter.area !== '' || filter.disciplinaID !== '' || filter.numeracao !== '') {
      setTempFilter(filter);
    }

    async function fetchDisciplinaAPI() {
      const response = await api.listarDisciplinas();
      const value = response.data.data;
      setListaDisciplina(value);
    }

    fetchDisciplinaAPI()
    return abortController.abort();
  }, []);

  const onFilterChange = (event) => {
    const { name, value } = event.target;
    setTempFilter(preValue => ({
      ...preValue,
      [name]: value
    }))
  }

  const onSubmit = () => {
    setFilter(tempFilter);
    setOpen(false);
  };

  const array = [];
  for (let i = 1; i < 33; ++i) array[i-1] = i;

  return (
    <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
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

          <Grid item={true} xs={12}>
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

          <Grid item={true} xs={12}>
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