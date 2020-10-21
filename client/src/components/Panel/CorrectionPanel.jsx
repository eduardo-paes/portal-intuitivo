import React, { useState, useEffect } from 'react';

import { GeneralSubtitle, MyCardContent } from "../../assets/styles/styledComponents"
import { Grid } from '@material-ui/core';

import api from "../../api";

export default function CorrectionPanel(props) {
    const {redacaoID, alunoID} = props;
    const [propostaRedacao, setPropostaRedacao] = useState([]);
    const [redacaoAluno, setRedacaoAluno] = useState([]);

    useEffect(() => {
        const abortController = new AbortController();
        fetchPropostaRedacao();
        return abortController.abort();
    },[redacaoID])

    return (
            <>
                <Grid container={true}>
                    <Grid item={true} xs={12} sm={6}>
                        <MyCardContent id="CorrectionCardQuestion">
                            <GeneralSubtitle>
                                Proposta de Redação
                            </GeneralSubtitle>
                        </MyCardContent>
                    </Grid>

                    <Grid item={true} xs={12} sm={6}>
                        <GeneralSubtitle>
                            Redação do Aluno
                        </GeneralSubtitle>
                    </Grid>
                </Grid>
            </>
    )
}