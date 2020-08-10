
import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import UploadButtons from "./UploadButton";

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

function Upload(props) {
  const {onUpload} = props;
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <UploadButtons handleUpload={onUpload}/>
    </div>
  );
}

export default Upload;