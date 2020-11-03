import React, { useContext } from 'react'
import { withRouter } from "react-router-dom";
import { StoreContext } from "../../utils"

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Slide, Button, Dialog, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

import Dashboard from '@material-ui/icons/Dashboard';
import StudyPlan from '@material-ui/icons/LibraryBooks';

// -- Local Styles
const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: "18.75rem",
    },
    centerContent: {
        justifyContent: "center",
        alignContent: "center"
    },
    buttonGroup: {
        display: "flex",
        paddingTop: "1rem",
        paddingBottom: "1rem",
        flexWrap: 'nowrap'
    },
    buttonLeft: {
        paddingRight: "0.2rem"
    },
    buttonRight: {
        paddingLeft: "0.2rem"
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const userName = (nomeAluno) => {
    var name = nomeAluno.split(' ').map(name => {
        return name;
    })
    return name[0];
}

function SlideDialog(props) {
    const classes = useStyles();
    const {history} = props;
    const {token} = useContext(StoreContext);
    const nomeAluno = userName(token.userName)

    return (
        <div>
            <Dialog
                open={true}
                TransitionComponent={Transition}
                keepMounted={true}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                className={classes.root}
            >
                <DialogTitle id="alert-dialog-slide-title">
                    {`Olá, ${nomeAluno}!`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Por onde gostaria de começar hoje?
                    </DialogContentText>

                    <Grid className={classes.buttonGroup} container={true} justify="center">
                        <div className={classes.buttonLeft}>
                            <Button variant="contained" onClick={() => history.push("/plano-estudo")} size="small" color="primary" startIcon={<StudyPlan />}>
                                Estudar
                            </Button>
                        </div>
                        <div className={classes.buttonRight}>
                            <Button variant="contained" onClick={() => history.push("/dashboard")} size="small" color="primary" startIcon={<Dashboard />}>
                                Navegar
                            </Button>
                        </div>
                    </Grid>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default withRouter(SlideDialog);
