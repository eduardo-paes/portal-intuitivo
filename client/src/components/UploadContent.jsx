import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DescriptionIcon from '@material-ui/icons/Description';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: 'none',
  },
  button: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(64),
  },
}));

export default function UploadContent(props) {
  const {onChange} = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
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
    </div>
  );
}