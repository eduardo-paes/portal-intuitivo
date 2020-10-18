import React, { useState, useEffect } from "react";

import { MyContainer, GeneralTitle, MyCard } from "../../assets/styles/styledComponents"
import { EssayFullWidthTabs } from "../../components";

import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import api from "../../api";

// -- Estilos locais
const useStyles = makeStyles((theme) => ({
    exampleCard: {
        marginTop: '1rem',
        minHeight: "15rem"
      },
      
      content: {
        fontStyle: 'normal',
        fontWeight: `300`,
        fontSize: '1rem',
        marginTop: '1rem',
        color: '#606161',
      },
      
      phrase: {
        fontSize: '1rem'
      },
      
      question: {
        padding: '1rem',
        paddingTop: '0rem'
      },
      
      questionProgress: {
        marginLeft: '2rem',
      },
      
      subTitle: {
        fontStyle: 'normal',
        fontWeight: `500`,
        fontSize: '1.25rem',
        marginTop: '1rem',
        color: '#606161',
      },
    
      tabs: {
        marginTop: '1rem',
      },
    
      title: {
        fontStyle: 'normal',
        fontWeight: `300`,
        fontSize: '1.25rem',
        color: '#606161',
      }
}));


// const StudentCardList = () => {
//     return (
//         <Grid item sm={9}>
//             <MyCard className={classes.exampleCard}>
//                 <Grid container direction='row' justify='space-evenly'>
//                 <Grid item={true} align="center" sm={4}>
//                     <h2 className={classes.title} id="melhorDesempenho">Química</h2>
//                     <MyCardContent>
//                     <GeneralSubtitle className={classes.content}>Corretas / Realizadas</GeneralSubtitle>
//                     <GeneralSubtitle className={classes.subTitle}>111 / 119</GeneralSubtitle>
//                     <QuestionCircularStatic className={classes.questionProgress} size={100} progresso={3.731092437}/>
//                     </MyCardContent>
//                 </Grid>
//                 <Grid item={true} align="center" sm={4}>
//                     <h2 className={classes.title} id="piorDesempenho">Sociologia</h2>
//                     <MyCardContent>
//                     <GeneralSubtitle className={classes.content}>Corretas / Realizadas</GeneralSubtitle>
//                     <GeneralSubtitle className={classes.subTitle}>67 / 107</GeneralSubtitle>
//                     <QuestionCircularStatic className={classes.questionProgress} size={100} progresso={2.504672897}/>
//                     </MyCardContent>
//                 </Grid>
//                 </Grid>
//             </MyCard>
//         </Grid>
//       )
// }

export default function EssayToCorrect (props) {
  const classes = useStyles();
  const essayID = props.match.params.atividadeID;

  const [redacoes, setRedacoes] = useState([]);
  const [wasLoaded, setWasLoaded] = useState({
    redacoes: false
  });

  const fetchRedacoes = async () => {
    
    if (!redacoes.length) {
      console.log(props.match.params);
      const response = await api.listarRedacoesNaoCorrigidasPorRedacaoID(essayID);
      const value = response.data;

      if (value.success) {
        setRedacoes(value.data);
        setWasLoaded(preValue => ({
          ...preValue,
          redacoes: true
        }))
      }
    }
  }


  useEffect(() => {
    const abortController = new AbortController();
    
    if (!wasLoaded.redacoes) {
      fetchRedacoes();
    }

    return abortController.abort();
    // eslint-disable-next-line
  },[essayID]);


  return (
    <MyContainer id="studentPageContainer">

        <section id="cabecalhoCorrigirRedacao">
            <GeneralTitle className="heading-page">Correção de Redação</GeneralTitle>
        </section>

        <section id="muralCorrigirRedacao">
          <Grid container={true} spacing={2}>
            <Grid item={true} xs={12}>
              <MyCard className={classes.tabs}>
                <EssayFullWidthTabs data={redacoes} />
              </MyCard>
            </Grid>
          </Grid>
        </section>

    </MyContainer>
  );
};
