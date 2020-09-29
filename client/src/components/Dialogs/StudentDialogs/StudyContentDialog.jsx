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
    const { topicoID, titulo, progresso, setProgresso, open, setOpen, setCheck } = props;
    const classes = useStyles();

    const handleClose = (event) => {
        setOpen(preValue => ({
            ...preValue,
            materialEstudo: false,
        }));
    };

    const handleFinalized = (event) => {
        const name = event.target.offsetParent.id;
        setCheck(preValue => ({
            ...preValue,
            [name]: true
        }));
        setProgresso(progresso+1);
        setOpen(preValue => ({
            ...preValue,
            materialEstudo: false,
        }));
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