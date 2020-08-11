import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DescriptionIcon from '@material-ui/icons/Description';
import VisibilityIcon from '@material-ui/icons/Visibility';

const useStyles = makeStyles((theme) => ({
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    marginLeft: "30%",
    marginRight: "30%",
    alignItems: "center",
    justifyContent: "space-between"
  },
  input: {
    display: 'none',
  },
  button: {
    width: '200px',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: '10px'
  }
}));

 function UploadContent(props) {
  const {onChange, onClick} = props;
  const classes = useStyles();

  return (
    <div className={classes.buttonsContainer}>
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
      <Button
        variant="contained"
        color="primary"
        component="span"
        className={classes.button}
        startIcon={<VisibilityIcon />}
        onClick={onClick}
      >
        Visualizar
      </Button>
    </div>
  );
}

export default UploadContent;