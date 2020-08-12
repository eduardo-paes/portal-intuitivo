import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DescriptionIcon from '@material-ui/icons/Description';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { /*AddButton,*/ DeleteButton } from '../assets/styles/styledComponents';
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  buttonsContainer: {
    width: '60%',
    display: "flex",
    flexDirection: "row",
    marginLeft: "25%",
    marginRight: "10%",
    alignItems: "center",
    justifyContent: "center"
  },
  input: {
    display: 'none',
  },
  button: {
    width: '200px',
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}));

 function UploadContent(props) {
  const {onChange, onSubmit, backTo} = props;
  const classes = useStyles();

  return (
    <Grid container spacing={0} className={classes.buttonsContainer}>
      <Grid item={true} xs={12} sm={6}>
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
      <Grid item={true} xs={12} sm={6}>
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
      <Grid item={true} xs={12} sm={6}>
        <Button 
          variant="contained"
          color="primary"
          onClick={onSubmit} 
          className={classes.button}
        >
          Salvar
        </Button>
      </Grid>
      <Grid item={true} xs={12} sm={6}>
        <Link to={backTo} style={{ textDecoration: 'none' }} >
          <DeleteButton >Voltar</DeleteButton>
        </Link>
      </Grid>
    </Grid>
  );
}

export default UploadContent;