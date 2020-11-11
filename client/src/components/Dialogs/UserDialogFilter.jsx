import React, { useEffect, useState } from 'react';
import { Button,  Dialog , Grid, DialogActions, DialogContent, DialogTitle, MenuItem } from '@material-ui/core';
import { MyTextField } from "../../assets/styles/styledComponents";

const initialFilter = {
  nome: '',
  email: '',
  acesso: '',
}

export default function UserDialogFilter(props) {
  const { filter, setFilter, open, setOpen, setIsCleaned } = props;
  const [tempFilter, setTempFilter] = useState(initialFilter);
  
  // -- Carregamentos iniciais
  useEffect(() => {
    const abortController = new AbortController();

    // Verifica se filtro já está preenchido
    if (filter !== initialFilter) {
      setTempFilter(filter);
    } else if (tempFilter !== initialFilter) {
      setTempFilter(initialFilter);
    }
      
    return abortController.abort();
    // eslint-disable-next-line
  }, [filter]);

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

          <Grid id="acessoGrid" item={true} xs={12}>
            <MyTextField
              id="campoAcesso"
              variant="outlined"
              select={true}
              label="Tipo de Acesso"
              name="acesso"
              value={tempFilter.acesso ? tempFilter.acesso : ""}
              onChange={onFilterChange}>
                <MenuItem value="Administrador">Administrador</MenuItem>
                <MenuItem value="Professor">Professor</MenuItem>
                <MenuItem value="Aluno">Aluno</MenuItem>
            </MyTextField>
          </Grid>

          <Grid id="nomeGrid" item={true} xs={12}>
            <MyTextField
              id="campoNome"
              variant="outlined"
              label="Nome"
              name="nome"
              value={tempFilter.nome ? tempFilter.nome : ""}
              onChange={onFilterChange}/>
          </Grid>

          <Grid id="emailGrid" item={true} xs={12}>
            <MyTextField
              id="campoEmail"
              variant="outlined"
              label="E-mail"
              name="email"
              value={tempFilter.email ? tempFilter.email : ""}
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