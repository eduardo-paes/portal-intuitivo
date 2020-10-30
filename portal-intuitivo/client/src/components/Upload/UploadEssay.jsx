import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { GreenButton } from '../../assets/styles/styledComponents'

const useStyles = makeStyles((theme) => ({
  input: {
    display: 'none',
  },
}));

export default function UploadEssay(props) {
  const { handleUpload, checked, primaryTitle, secondaryTitle } = props;
  const classes = useStyles();

  return (
    <>
      <input
        accept="image/*, application/*"
        className={classes.input}
        name="foto"
        id="contained-button-essay"
        single="true"
        type="file"
        onChange={handleUpload}
        />
      <label htmlFor="contained-button-essay">
        {
          checked
          ?   <GreenButton 
                fullWidth={true} 
                variant="contained" 
                color="primary" 
                component="span"
                startIcon={<CloudUploadIcon />}>{secondaryTitle}</GreenButton>
          :   <Button 
                fullWidth={true} 
                variant="outlined" 
                color="primary" 
                component="span"
                startIcon={<CloudUploadIcon />}>{primaryTitle}</Button>
        }
      </label>
    </>
  );
}