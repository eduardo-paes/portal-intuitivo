import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import PDFViewer from '../PDFViewer/PDFViewer';
import VisibilityIcon from '@material-ui/icons/Visibility';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(0),
  },
}))(MuiDialogContent);

export default function PDFPreviewDialog(props) {
  const { topico, conteudo, type } = props;
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {type ? <Button 
            variant="contained"
            color="primary"
            component="span"
            disabled={conteudo === "" ? true : false}
            startIcon={<VisibilityIcon />} 
            onClick={handleClickOpen}
        >Visualizar
        </Button> :
      <IconButton 
        aria-label="visualization" 
        color="primary" 
        size="small"
        onClick={handleClickOpen}> 
        <VisibilityIcon/> 
        </IconButton>}
      <Dialog 
        onClose={handleClose} 
        aria-labelledby="customized-dialog-title" 
        open={open} 
        fullWidth={true}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {topico}
        </DialogTitle>
        <DialogContent dividers>
            <PDFViewer source={conteudo}/>
        </DialogContent>
      </Dialog>
    </div>
  );
}
