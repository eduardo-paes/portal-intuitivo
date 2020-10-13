import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import { Button, Dialog, Divider, Grid, Typography } from '@material-ui/core';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';

import { TextEditor } from "../"

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    minWidth: "18.75rem",
    maxWidth: "31.25rem",
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
    minWidth: "18.75rem",
    maxWidth: "31.25rem",
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
    alignContent: "flex-end",
    minWidth: "18.75rem",
    maxWidth: "31.25rem",
  },
}))(MuiDialogActions);

export default function QuestionDialog(props) {
  const {enunciado, tipoResposta, resposta, padraoResposta, open, setOpen} = props;
  const optionsLetter = ["A)", "B)", "C)", "D)", "E)", "F)", "G)"]

  const handleClose = () => {
    setOpen(false);
  };

  const handlingWithMath = (text) => {
    if (text !== undefined && text.includes('<math')) {
      return (
        <TextEditor 
          optionType={false}
          text={text}
          readOnly={true}
        />
      );
    } else {
      return (
        <div id="mostrarEnunciadoQuestao" className='ck-content' dangerouslySetInnerHTML={{ __html: text}} />
      );
    }
  }

  return (
    <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
      <DialogTitle id="customized-dialog-title">
          Visualizar Questão
      </DialogTitle>
      <DialogContent dividers>
        { handlingWithMath(enunciado) }
        
        {
          (tipoResposta === "multiplaEscolha") 
              && resposta.map((item, index) => {
                return (
                  <div key={index} className={item.gabarito ? "correctOption" : "optionSection"}>
                    <Grid key={index} container={true} spacing={2} justify="center">
                      <Grid item={true} xs={1} sm={1} lg={1}>
                        <p className="optionsLetter">{optionsLetter[index]}</p>
                      </Grid>
                      <Grid item={true} xs={11} sm={11} lg={11}>
                        {handlingWithMath(item.opcao)}
                      </Grid>
                    </Grid>
                  </div>
                  );
              })
        }

        {
          padraoResposta !== '' && 
          <>
            <Divider style={{marginTop: "0.8rem"}}/>
            <Typography style={{marginTop: "1rem", color: "#606161"}} variant="h6">Padrão Resposta</Typography>
            <div id="mostrarPadraoRespostaQuestao" className='ck-content' dangerouslySetInnerHTML={{ __html: padraoResposta}} />
          </>
        }
      </DialogContent>
      <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
              Voltar
          </Button>
      </DialogActions>
    </Dialog>
  );
}