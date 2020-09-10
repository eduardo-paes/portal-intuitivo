import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

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
  },
}));

export default function UploadButtons(props) {
  const {handleUpload} = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <input
        accept="image/*"
        className={classes.input}
        name="foto"
        id="contained-button-photo"
        single="true"
        type="file"
        onChange={handleUpload}
        />
      <label htmlFor="contained-button-photo">
        <Button
          variant="contained"
          color="primary"
          component="span"
          className={classes.button}
          startIcon={<PhotoCamera />}
      >
        Upload
        </Button>
      </label>
    </div>
  );
}