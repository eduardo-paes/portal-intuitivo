import React from 'react';

import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import { makeStyles } from '@material-ui/core/styles';
import DescriptionIcon from '@material-ui/icons/Description';
import VisibilityIcon from '@material-ui/icons/Visibility';

const useStyles = makeStyles((theme) => ({
  buttonsContainer: {
    width: '100%',
    display: "flex",
    flexDirection: "row",
    marginLeft: "auto",
    marginRight: "auto",
    alignItems: "center"
  },
  input: {
    display: 'none',
  },
  button: {
    width: '190px',
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}));

 function UploadContent(props) {
  const {onChange, onSubmit, backTo} = props;
  const classes = useStyles();

  return (
    <Grid container spacing={10} className={classes.buttonsContainer}>
      <Grid item={true} xs={6} sm={3}>
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
          className={classes.button}
          startIcon={<DescriptionIcon />}
        >
          Subir Conteúdo
        </Button>
        </label>
      </Grid>
      <Grid item={true} xs={6} sm={3}>
        <Button
          variant="contained"
          color="primary"
          component="span"
          className={classes.button}
          startIcon={<VisibilityIcon />}
        >
          Visualizar
        </Button>
      </Grid>
      <Grid item={true} xs={6} sm={3}>
        <Button 
          variant="contained"
          color="primary"
          onClick={onSubmit} 
          className={classes.button}
        >
          Salvar
        </Button>
      </Grid>
      <Grid item={true} xs={6} sm={3}>
        <Link to={backTo} style={{ textDecoration: 'none' }} >
          <Button 
            variant="contained"
            color="secondary"
            className={classes.button}
          >
            Voltar  
          </Button>
        </Link>
      </Grid>
    </Grid>
  );
}

export default UploadContent;