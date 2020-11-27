import React from 'react';

import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import { makeStyles } from '@material-ui/core/styles';
import DescriptionIcon from '@material-ui/icons/Description';
import VisibilityIcon from '@material-ui/icons/Visibility';
import PDFPreviewDialog from '../Dialogs/PDFPreviewDialog';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  input: {
    display: 'none',
  }
}));

export default function UploadContent(props) {
  const {onChange, onSubmit, backTo, conteudo, topico } = props;
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  return (
    <Grid container={true} spacing={2}>
      <Grid item={true} xs={12} sm={3}>
        <input
          accept="file_extension/*"
          className={classes.input}
          name="conteudo"
          id="contained-button-file"
          single="true"
          type="file"
          onChange={onChange}
        />
        <label htmlFor="contained-button-file">
          <Button
            variant="contained"
            color="primary"
            component="span"
            fullWidth={true}
            startIcon={<DescriptionIcon />}
          > Subir Conteúdo </Button>
        </label>
      </Grid>

      <Grid item={true} xs={12} sm={3}>
        <Button 
          variant="contained"
          color="primary"
          component="span"
          fullWidth={true}
          disabled={conteudo.url === "" ? true : false}
          startIcon={<VisibilityIcon />} 
          onClick={() => {setOpen(!open)}}
        > Visualizar </Button>

        <PDFPreviewDialog 
          topico={topico} 
          conteudo={conteudo.url}
          open={open}
          setOpen={setOpen}
        />
      </Grid>

      <Grid item={true} xs={6} sm={3}>
        <Button 
          variant="contained"
          color="primary"
          onClick={onSubmit} 
          fullWidth={true}
        > Salvar </Button>
      </Grid>
      
      <Grid item={true} xs={6} sm={3}>
        <Link to={backTo} style={{ textDecoration: 'none' }} >
          <Button 
            variant="contained"
            color="secondary"
            fullWidth={true}
          > Voltar </Button>
        </Link>
      </Grid>
    </Grid>
  );
}