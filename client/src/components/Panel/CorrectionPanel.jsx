import React, { useEffect, useState } from 'react';

import { GeneralSubtitle, MyCardContent } from "../../assets/styles/styledComponents"
import { makeStyles, Grid, Button, Divider } from '@material-ui/core';
import Image from 'material-ui-image'

import api from "../../api";
import './styles.css';

const useStyles = makeStyles((theme) => ({
    container: {
      margin: "1rem"
    },
    buttonGroup: {
        textAlign: 'center'
    },
    button: {
        margin: '0.5rem'
    },
    divider: {
        marginRight: '1rem'
    },
    itemGrid: {
        minHeight: 400,
        minWidth: 500,
    }
  }));

export default function CorrectionPanel(props) {
    const classes = useStyles();

    const {redacaoID, alunoID} = props;
    const [propostaRedacao, setPropostaRedacao] = useState('');
    const [redacaoAluno, setRedacaoAluno] = useState([]);
    const [imgURL, setImgURL] = useState('');
    const [wasLoaded, setWasLoaded] = useState({
        proposta: false,
        redacaoAluno: false
    });

    useEffect(() => {
        const abortController = new AbortController();
        if (alunoID && redacaoID) {
            var aux = alunoID + redacaoID;
            setImgURL(`http://localhost:5000/uploads/redacao/${aux}.jpeg`)
            console.log(`http://localhost:5000/uploads/redacao/${aux}.jpg`);
        }
        // eslint-disable-next-line 
        return abortController.abort();
    },[alunoID]);

    const fetchPropostaRedacao = async () => {
        const response = await api.encPropostaRedacao(redacaoID);
        const value = response.data;

        if (value.success) {
            setPropostaRedacao(value.data.questaoID.enunciado);
            setWasLoaded(preValue => ({
                ...preValue,
                proposta: true
            }))
        }
    }

    useEffect(() => {
        const abortController = new AbortController();
        if (!wasLoaded.proposta) {
            fetchPropostaRedacao();
        }
        return abortController.abort();
    },[redacaoID])

    return (
        <>
            <Grid className={classes.container} container={true} spacing={1} align='center'>
                <Grid id="propostaRedacao" className={classes.itemGrid} item={true} xs={12} sm={6} align='center'>
                    <GeneralSubtitle>
                        Proposta de Redação
                    </GeneralSubtitle>
                    <MyCardContent id="CorrectionCardQuestion" className={classes.myCard}>
                        <div id="propostaRedacao" className='ck-content' dangerouslySetInnerHTML={{ __html: propostaRedacao}} />
                    </MyCardContent>
                </Grid>

                <Divider orientation='vertical' className={classes.divider}/>

                <Grid id="redacaoAluno" className={classes.itemGrid} item={true} xs={12} sm={5} align='center'>
                    <GeneralSubtitle>
                        Redação do Aluno
                    </GeneralSubtitle>
                    <Image src={imgURL} alt='Redação do Aluno'/>
                    <Button className={classes.button} variant="outlined" color="primary">
                        Baixar Redação
                    </Button>

                    <Button className={classes.button}  variant="outlined" color="primary">
                        Enviar Correção
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}