import React from 'react';

import { TextEditor } from "../";
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';


const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    width: "31.25rem"
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function CustomDialog(props) {
  const {enunciado, tipoResposta, resposta, open, setOpen} = props;
  const optionsLetter = ["A)", "B)", "C)", "D)", "E)", "F)", "G)"]

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title">
            Visualizar Questão
        </DialogTitle>
        <DialogContent dividers>
          <TextEditor 
            id="mostrarEnunciadoQuestao"
            text={enunciado}
            readOnly={true}
          />
          { 
            (tipoResposta === "multiplaEscolha") 
                && resposta.map((item, index) => {
                  return (
                    <div key={index} className="optionSection">
                      <Grid key={index} container={true} spacing={2}>
                            <Grid item={true} xs={1} sm={1} lg={1}>
                              <p className="optionsLetter">{optionsLetter[index]}</p>
                            </Grid>
                            <Grid item={true} xs={11} sm={11} lg={11}>
                                  <TextEditor 
                                      id="mostrarOpcoesQuestao"
                                      text={item.opcao}
                                      readOnly={true}
                                  />
                            </Grid>
                      </Grid>
                    </div>
                    );
                })
          }
        </DialogContent>
        <DialogActions>
            <Button autoFocus onClick={handleClose} color="primary">
                Voltar
            </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}