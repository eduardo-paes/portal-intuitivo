import React from 'react';

import { GeneralSubtitle, MyCardContent } from "../../assets/styles/styledComponents"
import { makeStyles, Grid } from '@material-ui/core';

// import api from "../../api";

const useStyles = makeStyles((theme) => ({
    container: {
      marginLeft: "1rem"
    },
  }));

export default function CorrectionPanel(props) {
    const classes = useStyles();

    // const {redacaoID, alunoID} = props;
    // const [propostaRedacao, setPropostaRedacao] = useState([]);
    // const [redacaoAluno, setRedacaoAluno] = useState([]);

    // useEffect(() => {
    //     const abortController = new AbortController();
    //     fetchPropostaRedacao();
    //     return abortController.abort();
    // },[redacaoID])

    return (
            <>
                <Grid className={classes.container} container={true} spacing={2}>
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