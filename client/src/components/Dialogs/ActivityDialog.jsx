import React, { useEffect, useState } from 'react';
import api from '../../api'

import { withStyles, makeStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { Button, Dialog, Grid, Typography, Divider } from '@material-ui/core';

import { QuestionNumeration } from '../../assets/styles/styledComponents';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    minWidth: "18.75rem",
    maxWidth: "31.25rem",
  }
});

const useStyle = makeStyles(() => ({
  firstQuestionNumeration: {
    marginTop: '0'
  }, 
  divider: {
    marginTop: '1rem'
  }
}));

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
    minWidth: "18.75rem"
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
    alignContent: "flex-end",
    minWidth: "18.75rem"
  },
}))(MuiDialogActions);

export default function ActivityDialog(props) {
  const classes = useStyle();
  const {atividadeID, open, setOpen} = props;
  const [questoes, setQuestoes] = useState([]);
  const optionsLetter = ["A)", "B)", "C)", "D)", "E)", "F)", "G)"]

  async function fetchQuestoesAPI() {
    const response = await api.encQuestoesDaAtividadeID(atividadeID);
    if (response.data.success) {
      const value = response.data.data;
      setQuestoes(value);
    }
  }

  useEffect(() => {
    const abortController = new AbortController();
    if (atividadeID !== '') {
      fetchQuestoesAPI()
    }
    return abortController.abort();
  }, [atividadeID])

  const handleClose = () => {
    setOpen(false);
  };

  const displayQuestion = (questao, index) => {
    const { enunciado, resposta, tipoResposta } = questao;
    return (
      <>
        <QuestionNumeration className={ index === 0 ? classes.firstQuestionNumeration : 'none' }>Questão {index + 1}</QuestionNumeration>
        <div id="mostrarEnunciadoQuestao" className='ck-content' dangerouslySetInnerHTML={{ __html: enunciado}} />
        { tipoResposta === "multiplaEscolha" && resposta.map((item, index) => {
          return (
            <div key={index} className="optionSection">
              <Grid key={index} container={true} spacing={2} justify="center">
                <Grid item={true} xs={1} sm={1} lg={1}>
                  <p className="optionsLetter">{optionsLetter[index]}</p>
                </Grid>
                <Grid item={true} xs={11} sm={11} lg={11}>
                  <div id="mostrarOpcoesQuestao" className='ck-content' dangerouslySetInnerHTML={{ __html: item.opcao }} />
                </Grid>
              </Grid>
            </div>
          );
        }) }
        { (index + 1) < questoes.length && <Divider className={classes.divider}/> }
      </>    
    )
  }

  return (
    <Dialog onClose={handleClose} fullWidth={true} maxWidth='sm' aria-labelledby="customized-dialog-title" open={open}>
      <DialogTitle id="customized-dialog-title">
          Visualizar Questões
      </DialogTitle>
      <DialogContent dividers={true}>
        {questoes.map((questao, index) => {
          return <div key={index}>{displayQuestion(questao.questaoID, index)}</div>
        })}
      </DialogContent>
      <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
              Voltar
          </Button>
      </DialogActions>
    </Dialog>
  );
}