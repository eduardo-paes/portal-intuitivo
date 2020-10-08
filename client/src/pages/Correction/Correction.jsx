import React, { useEffect, useState } from "react";
import { GeneralTitle, GeneralSubtitle, MyContainer } from "../../assets/styles/styledComponents"
import { Button, Grid } from "@material-ui/core";
// import api from '../../api'

export default function Correction(props) {

    return (
        <MyContainer>
            <section id="correctionHeader">
                <Grid container={true} spacing={1}>
                    <Grid item={true} xs={12} sm={12}>
                        <GeneralTitle id="correctionTitle">Correção de Atividades</GeneralTitle>
                    </Grid>
                    <Grid item={true} xs={12} sm={12}>
                        <GeneralSubtitle id="correctionSubTitle">Selecione o tipo de questão que deseja corrigir.</GeneralSubtitle>
                    </Grid>
                </Grid>
            </section>

        </MyContainer>
    )
}