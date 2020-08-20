import React from "react";

// -- Styles
import { MyContainer, CreateButton } from "../../assets/styles/styledComponents"
import { Grid } from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';

// -- Local Styles
const useStyles = makeStyles((theme) => ({
    buttons: {
        marginTop: theme.spacing(2),
        margin: theme.spacing(1)
    },
    root: {
        flexGrow: 1
    },
    group: {
        textAlign: "center"
    }
}));

function QuestionInsert() {
    const classes = useStyles();

        return (
        <MyContainer>
            <header>
                <Grid container={true} className={classes.root} spacing={2}>
                    <Grid item={true} xs={12} sm={9}>
                        <h1 className="heading-page">Banco de Questões</h1>
                    </Grid>

                    <Grid item={true} xs={12} sm={3}>
                        <CreateButton title="Inserir Questão" url="/controle-questoes/create"/>
                    </Grid>
                </Grid>
            </header>

            <main>
                Questões serão listadas aqui
            </main>
        </MyContainer>
    );
};

export default QuestionInsert;