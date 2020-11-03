import React from 'react';

// -- Components
import { AppBar, Button, Dialog, Grid, IconButton, Slide, Toolbar, Typography } from '@material-ui/core';
import { PDFViewer } from '../../'

// -- Styles
import { useStyles } from './styles';

// -- Icons
import CloseIcon from '@material-ui/icons/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
}); 

export default function StudyContentDialog(props) {
    const { topicoID, titulo, progresso, setProgresso, open, setOpen, check, setCheck, setWasChecked } = props;
    const classes = useStyles();

    // Fecha slide com conteúdo
    const handleClose = () => {
        setOpen(preValue => ({
            ...preValue,
            materialEstudo: false,
        }));
    };

    // Marca conteúdo como finalizado / concluído
    const handleFinalized = () => {
        if (!check.materialEstudo) {
            setCheck(preValue => ({
                ...preValue,
                materialEstudo: true
            }));
            setProgresso(progresso + 1);
            setWasChecked(true);
        }
        handleClose();
    };

    return (
        <Dialog fullScreen={true} open={open.materialEstudo} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton id="materialEstudo" edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        {titulo}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Grid container={true} spacing={3}>
                <Grid className={classes.material} item={true} xs={12} lg={12} sm={12} align='center'>
                    <PDFViewer source={ `http://localhost:5000/uploads/content/${topicoID}.pdf`}/>
                </Grid>
                <Grid item={true} xs={12} lg={12} sm={12} align='center' >
                    <Button id="materialEstudo" variant='contained' color="primary" onClick={handleFinalized}>
                        Finalizado
                    </Button>
                </Grid>
            </Grid>    
        </Dialog>
    )
}