import React, { useState } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';

import { MathComponent } from 'mathjax-react'

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
  const {enunciado, tipoResposta, resposta, open, setOpen} = props;
  const optionsLetter = ["A)", "B)", "C)", "D)", "E)", "F)", "G)"]
  const [mout, setMount] = useState(true);

  const [mathText, setMathText] = useState('');

  const handleClose = () => {
    setOpen(false);
  };

  const handlingWithMath = (text) => {
    if (text !== undefined && text.includes('<math')) {
      
      var value = text.split('<math').map(item => {
        if (item.includes('</math>')) {
          return '<math' + item;
        }
        return item;
      })

      let final = [];
      value = value.map(item => {
        return item.split('</math>').map(aux => {
          if (aux.includes('<math')) {
            final.push(aux + '</math>');
            return aux + '</math>';
          }
          final.push(aux);
          return aux;
        })
      })

      setMathText(final);
    }
  }

  const renderMath = () => {
    if (mout && mathText !== '') {
      mathText.map(item => {
        if (item.includes('<math')) {
          console.log(item)
          return (<MathComponent mathml={item} />);
        }
        console.log(item)
        return (<div id="mostrarEnunciadoQuestao" className='ck-content' dangerouslySetInnerHTML={{ __html: item}} />);
      })
      setMount(false);
    }
  }

  return (
    <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
      <DialogTitle id="customized-dialog-title">
          Visualizar Questão
      </DialogTitle>
      <DialogContent dividers>
        <div id="mostrarEnunciadoQuestao" className='ck-content' dangerouslySetInnerHTML={{ __html: enunciado}} />
        {
          (tipoResposta === "multiplaEscolha") 
              && resposta.map((item, index) => {
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
              })
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