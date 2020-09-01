import React from "react";

// -- Estilos
import { MyContainer, CreateButton } from "../../assets/styles/styledComponents"
// import { ActivityTable } from "../../components";
import { Grid } from '@material-ui/core';

export default function AcitivityList() {
    

    return (
        <MyContainer>
            <h1 className="heading-page">Atividades</h1>
            <Grid container={true} spacing={2} justify="center">
                <Grid id="cabecalhoListaQuestao" item={true} xs={12} sm={12} lg={12}>
                    <CreateButton title="Inserir Atividade" url="/controle-atividades/create"/>
                    {/* <ActivityTable data={atividades}/> */}
                </Grid>
            </Grid>

        </MyContainer>
    );
};