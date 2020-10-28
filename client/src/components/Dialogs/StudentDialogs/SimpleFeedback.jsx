import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TextField } from '@material-ui/core';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SimpleFeedback(props) {
    const { open, setOpen, title, message } = props;

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>

            <DialogContent>
                {
                    message === 'addComment' 
                    ? <TextField/>
                    : <DialogContentText id="alert-dialog-slide-description">{message}</DialogContentText>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)} color="primary">
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