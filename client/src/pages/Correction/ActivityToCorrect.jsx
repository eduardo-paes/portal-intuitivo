import React, { useEffect, useState } from "react";

import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { MyContainer, MyCard, MyCardContent, GeneralTitle, GeneralSubtitle } from "../../assets/styles/styledComponents"
import { Grid, AppBar, Tabs, Tab, Typography, Box } from "@material-ui/core";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import WeeklyProgress from "../../components/ProgressBar/WeeklyProgress";
import CircularStatic from "../../components/ProgressBar/CircularStatic";
import QuestionCircularStatic from "../../components/ProgressBar/QuestionProgress";
import { FullWidthTab } from "../../components";
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

export default function ActivityToCorrect (props) {
    
  let progresso = 3;
  let numTasks = 5; 
  const classes = useStyles();
  const [ wasLoaded, setWasLoaded ] = useState(false);
  const [ listarPorAluno, setListarPorAluno ] = useState(false);
  const [ respostaAluno, setRespostaAluno ] = useState([]);
  const [ alunos, setAlunos ] = useState([]);
  const [ questoes, setQuestoes ] = useState([]);
  const [ indice, setIndice ] = useState(0);

  async function pegarRespostasAluno(atividadeID) {
    const response = await api.listarRAPorAtividadeID(atividadeID);
    if (response.data.success) setRespostaAluno(response.data.data);
    setWasLoaded(true)
  }

  async function listarQuestoes() {
    let aux = [];
    if (respostaAluno.length !== 0) {
      respostaAluno[0].atividadeID.questoes.map( async (row, index) => {
        const { enunciado, resposta, padraoResposta, tipoResposta } = row.questaoID;
        aux.push({ enunciado, resposta, padraoResposta, tipoResposta });
      })
      setQuestoes(aux);
    }
  }

  function listarAlunos() {
    let aux = alunos;
    if (respostaAluno.length !== 0) {
      respostaAluno.map( async (row, index) => {
        const { _id, nome } = row.alunoID;
        aux.push({_id, nome});
      })
      setAlunos(aux);
    }
  }

  // const listarOpcoes = (questao, questaoID) => {
    
  //   if (questao.tipoResposta === "multiplaEscolha") {
  //       return (
  //           <Grid className={classes.questionGrid} item={true} align="left" xs={12} lg={12} sm={12}>
  //               <RadioAnswer 
  //                   idQuestion={questaoID}
  //                   answered={answered} 
  //                   gabarito={gabarito.gab._id} 
  //                   mobile={mobile}
  //                   respostaMobile={respostaMobile} 
  //                   resposta={resposta}
  //                   respostaQuestao={respostaQuestao}
  //                   setRespostaQuestao={setRespostaQuestao}
  //               />
  //           </Grid>
  //       )
  //   }
    
  //   if (questao.tipoResposta === "discursiva") {
  //       return (
  //           <Grid className={classes.questionGrid} item={true} align="center" xs={12} lg={12} sm={12}>
  //               <TextField
  //                   className={classes.answerField}
  //                   id={respostaQuestao.questao ? respostaQuestao.questao : ''}
  //                   label={answered ? null : "Resposta"}
  //                   disabled={answered}
  //                   multiline
  //                   value={
  //                       respostaQuestao.resposta && !mobile ?
  //                       respostaQuestao.resposta : 
  //                       respostaQuestao.resposta && mobile ?
  //                       respostaMobile : null
  //                   }
  //               />
  //           </Grid>
  //       )
  //   }
  // }

  useEffect(() => {
    pegarRespostasAluno('5f748e1d456f54037534cab1');
    listarAlunos();
    listarQuestoes();
    console.log(respostaAluno[0]);
  }, [wasLoaded])

  function ListarRAPorQuestao() {
    console.log(questoes);
    if (respostaAluno.length !== 0 && questoes.length !== 0) {
      return (
        <>
          <Grid item={true} xs={12} sm={4}>
            <MyCard className={classes.exampleCard}>
              <MyCardContent className={classes.question}>
                <h2 className={classes.title}  id="questaoNumeracao">{`Questão ${indice + 1}`}</h2>
                <Grid item={true} align="center">
                  <div id="mostrarEnunciadoQuestao" className='ck-content' dangerouslySetInnerHTML={{ __html: questoes[indice].enunciado}} />
                </Grid>
              </MyCardContent>
            </MyCard>
          </Grid>
  
          <Grid item={true} xs={12} sm={5}>
            <MyCard className={classes.exampleCard}>
              <h2 className={classes.title} id="piorDesempenho">Sociologia</h2>
              <MyCardContent>
                <Grid item={true} align="center">
                  <GeneralSubtitle className={classes.content}>Corretas / Realizadas</GeneralSubtitle>
                  <GeneralSubtitle className={classes.subTitle}>67 / 107</GeneralSubtitle>
                  <QuestionCircularStatic className={classes.questionProgress} size={100} progresso={2.504672897}/>
                </Grid>
              </MyCardContent>
            </MyCard>
          </Grid>
        </>
      )
    }
  }

  function ListarRAPorAluno() {
    return (
      <Grid item sm={9}>
        <MyCard className={classes.exampleCard}>
          <Grid container direction='row' justify='space-evenly'>
            <Grid item={true} align="center" sm={4}>
              <h2 className={classes.title} id="melhorDesempenho">Química</h2>
              <MyCardContent>
                <GeneralSubtitle className={classes.content}>Corretas / Realizadas</GeneralSubtitle>
                <GeneralSubtitle className={classes.subTitle}>111 / 119</GeneralSubtitle>
                <QuestionCircularStatic className={classes.questionProgress} size={100} progresso={3.731092437}/>
              </MyCardContent>
            </Grid>
            <Grid item={true} align="center" sm={4}>
              <h2 className={classes.title} id="piorDesempenho">Sociologia</h2>
              <MyCardContent>
                <GeneralSubtitle className={classes.content}>Corretas / Realizadas</GeneralSubtitle>
                <GeneralSubtitle className={classes.subTitle}>67 / 107</GeneralSubtitle>
                <QuestionCircularStatic className={classes.questionProgress} size={100} progresso={2.504672897}/>
              </MyCardContent>
            </Grid>
          </Grid>
        </MyCard>
      </Grid>
    )
  }

  return (
    <MyContainer id="activityContainer">

      <section id="cabecalhoAtividade">
        <GeneralTitle className="heading-page">Atividade</GeneralTitle>
      </section>

      <section id="muralDashboard">
        <Grid container={true} spacing={2}>

          <Grid item={true} xs={12} sm={12}>
            <WeeklyProgress />
          </Grid>

          <Grid item={true} xs={12} sm={3}>
            <MyCard className={classes.tabs}>
              <FullWidthTab 
                questoes={
                  respostaAluno.length !== 0 ? 
                  respostaAluno[0].respostaQuestaoIDs : 0
                }
                alunos={ alunos }
                listarPorAluno={listarPorAluno}
                setListarPorAluno={setListarPorAluno}
                setIndice={setIndice}
              />
            </MyCard>
          </Grid>

          { 
            listarPorAluno ? 
            ListarRAPorAluno() :
            ListarRAPorQuestao()
          }

        </Grid>
      </section>

    </MyContainer>
  );
};
