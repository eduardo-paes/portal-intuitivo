import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TextField } from '@material-ui/core';
import apis from '../../../api';
import { useState } from 'react';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SimpleFeedback(props) {
    const { open, setOpen, title, message, questionID } = props;
    const [ comment, setComment ] = useState('');

    async function adicionandoComentario() {
        if (questionID){
            const response = await apis.encRespostaQuestaoPorID(questionID);
            let novaResposta = response.data.data;
            novaResposta.comentario = comment;
            //console.log(id);
            await apis.atualizarRespostaQuestao(questionID, novaResposta);
        }
        setOpen(false);
    }

    function handleChange(event) {
        const { value } = event.target;
        setComment(value);
    }

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted={true}
            onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>

            <DialogContent>
                {
                    message === 'addComment' 
                    ? <TextField multiline onChange={handleChange}/>
                    : <DialogContentText id="alert-dialog-slide-description">{message}</DialogContentText>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={adicionandoComentario} color="primary">
                    {
                        message === 'addComment' 
                        ? 'Inserir comentário'
                        : 'Ok'
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
}