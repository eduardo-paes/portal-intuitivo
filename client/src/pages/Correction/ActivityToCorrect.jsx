import React, { useEffect, useState } from "react";

import { makeStyles } from '@material-ui/core/styles';
import { MyContainer, MyCard, MyCardContent, GeneralTitle, GreenButton, AddButton } from "../../assets/styles/styledComponents"
import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails, Avatar, TextField, Button, IconButton } from "@material-ui/core";
import { DiscreteSlider, FullWidthTab, SimpleFeedback, SimpleRadio } from "../../components";
import api from "../../api";
import WeeklyProgress from "../../components/ProgressBar/WeeklyProgress";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddCommentIcon from '@material-ui/icons/AddComment';
import RateReviewIcon from '@material-ui/icons/RateReview';

// -- Estilos locais
const useStyles = makeStyles((theme) => ({
  
  accordion: {
    marginTop: '1rem',
    minHeight: "15rem"
  },

  card: {
    marginTop: '1rem',
    minHeight: "15rem"
  },
  
  comment: {
    marginTop: '1rem',
    width: '100%'
  },
  
  commentChanged: {
    marginTop: '1rem',
    width: '90%'
  },

  commentIcon: {
    marginTop: '1rem'
  },

  content: {
    fontStyle: 'normal',
    fontWeight: `300`,
    fontSize: '1rem',
    marginTop: '1rem',
    color: '#606161',
  },

  discursiveAnswer: {
    width: '100%'
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

  student: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    paddingLeft: '1rem'
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
    
  let numTasks = 0; 
  let aCorrigirAluno = [];
  let aCorrigirQuestao = [];
  const classes = useStyles();
  const [ wasLoaded, setWasLoaded ] = useState(false);
  const [ flag, setFlag ] = useState(false);
  const [ listarPorAluno, setListarPorAluno ] = useState(false);
  const [ respostaAluno, setRespostaAluno ] = useState([]);
  const [ alunos, setAlunos ] = useState([]);
  const [ questoes, setQuestoes ] = useState([]);
  const [ indice, setIndice ] = useState(0);
  const [ aux, setAux ] = useState(0);
  const [ notaAluno, setNotaAluno ] = useState(0);
  const [ progresso, setProgresso ] = useState(0);
  const [ comment, setComment ] = useState('');

  async function pegarRespostasAluno(atividadeID) {
    const response = await api.listarRAPorAtividadeID(atividadeID);
    if (response.data.success) setRespostaAluno(response.data.data);
    setWasLoaded(true)
  }

  async function listarQuestoes() {
    let aux = [];
    if (respostaAluno.length !== 0) {
      respostaAluno[0].atividadeID.questoes.map( async (row, index) => {
        if (row.questaoID.tipoResposta === 'discursiva') {
          const { enunciado, resposta, padraoResposta, tipoResposta } = row.questaoID;
          aux.push({ enunciado, resposta, padraoResposta, tipoResposta });
        }
        
      })
      setQuestoes(aux);
    }
  }

  function calcularProgressoGeral () {
    setAux(0);
    respostaAluno.forEach((item, index) => {
      item.respostaQuestaoIDs.map((row, index) => {
        if (row.corrigido === false) {
          ++numTasks;
          aCorrigirQuestao[index] = true;
        }
      })
    });
  }

  function listarAlunos() {
    let aux = alunos;
    if (respostaAluno.length !== 0) {
      respostaAluno.map( async (row, index) => {
        const { _id, nome } = row.alunoID;
        const { corrigido } = row;
        if(!row.respostaQuestaoIDs.find(element => element.corrigido === false)) {
          let novaResposta = row;
          novaResposta.corrigido = true;
          await api.atualizarRespostaAluno(row._id, novaResposta);
        };
        aux.push({_id, nome, corrigido});
      })
      setAlunos(aux);
    }
  }
  
  //#region Comentário
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
  //#endregion
  
  useEffect(() => {
    pegarRespostasAluno('5f6e088852b44f08881e63f8');
    calcularProgressoGeral();
    console.log(aCorrigirQuestao);
    listarAlunos();
    listarQuestoes();
  }, [wasLoaded])

  function retornarRespostaDiscursiva(defaultValue, resposta, id, comentario) {
    
    async function adicionandoComentario() {
      const response = await api.encRespostaQuestaoPorID(id);
      let novaResposta = response.data.data;
      novaResposta.comentario = comment;
      // console.log(novaResposta);
      //console.log(id);
      await api.atualizarRespostaQuestao(id, novaResposta);
      setFlag(false);
    }
  
    function handleChange(event) {
      const { value } = event.target;
      setComment(value);
      setFlag(true);
    }

    return (
      <Grid item={true} align="center" xs={12} lg={12} sm={12}>
        <TextField
          className={classes.discursiveAnswer}
          disabled={true}
          multiline
          value={resposta}
        />
        <TextField 
          className={flag ? classes.commentChanged : classes.comment}
          multiline
          label='Comentário'
          onChange={handleChange}
          defaultValue={comentario ? comentario : ''}
        />
        <IconButton size='medium' className={classes.commentIcon} color='primary' onClick={adicionandoComentario}>
          {
            flag ?
              comentario 
              ? <RateReviewIcon />
              : <AddCommentIcon />
            : <></>  
          }
        </IconButton>
        {/* <SimpleFeedback open={openComment} setOpen={setOpenComment} title='Adicionar Comentário' message='addComment' questionID={id}/> */}
        {/* <SimpleRadio title='Nota' value={notaAluno} setValue={setNotaAluno}/> */}
        <DiscreteSlider respostaQuestaoID={id} defaultValue={defaultValue} setProgresso={setProgresso} progresso={progresso}/>
      </Grid>
    )
  }

  function ListarRAPorQuestao() {
    if (respostaAluno.length !== 0 && questoes.length !== 0) {
      return (
        <>
          <Grid item={true} xs={12} sm={4}>
            <MyCard className={classes.card}>
              <MyCardContent className={classes.question}>
                <h2 className={classes.title}  id="questaoNumeracao">{`Questão ${indice + 1}`}</h2>
                <Grid item={true} align="center">
                  <div id="mostrarEnunciadoQuestao" className='ck-content' dangerouslySetInnerHTML={{ __html: questoes[indice].enunciado}} />
                </Grid>
              </MyCardContent>
            </MyCard>
          </Grid>
  
          <Grid item={true} xs={12} sm={5} className={classes.accordion}>
            {
              respostaAluno.length !== 0 ? 
              respostaAluno.map((row, index) => {
                return (
                  <Accordion key={index}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                    >
                      <Avatar sizes="small" src={`http://localhost:5000/uploads/profile/${row.alunoID._id}.jpeg`} alt="Preview"/>
                      <Typography className={classes.student}>{row.alunoID.nome}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      { retornarRespostaDiscursiva(row.respostaQuestaoIDs[indice].nota, row.respostaQuestaoIDs[indice].resposta, row.respostaQuestaoIDs[indice]._id, row.respostaQuestaoIDs[indice].comentario) }
                    </AccordionDetails>
                  </Accordion>
                )
              }) : null
            }
          </Grid>
        </>
      )
    }
  }

  function ListarRAPorAluno() {
    return (
      <Grid item sm={9} className={classes.accordion}>
        {
          questoes.length !== 0 ? 
          questoes.map((row, index) => {
            return (
              <Accordion key={index}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                >
                  <Typography>{`Questão ${index+1}`}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container>
                    <Grid item sm={6}>
                      <Grid item={true} align="center">
                        <div id="mostrarEnunciadoQuestao" className='ck-content' dangerouslySetInnerHTML={{ __html: questoes[index].enunciado}} />
                      </Grid>
                    </Grid>
                    <Grid item sm={6}>
                      <Grid item={true} align="center">
                      { retornarRespostaDiscursiva(respostaAluno[indice].respostaQuestaoIDs[index].nota , respostaAluno[indice].respostaQuestaoIDs[index].resposta, respostaAluno[indice].respostaQuestaoIDs[index]._id) }
                      </Grid>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )
          }) : null
        }
      </Grid>
    )
  }

  return (
    <MyContainer id="activityContainer">

      <section id="cabecalhoAtividade">
        <GeneralTitle className="heading-page">{`Atividade de ${ respostaAluno.length !== 0 ? respostaAluno[0].atividadeID.tipoAtividade : 'Fixação'}`}</GeneralTitle>
      </section>

      <section id="muralDashboard">
        <Grid container={true} spacing={2}>

          <Grid item={true} xs={12} sm={12}>
            <WeeklyProgress max={numTasks} progresso={progresso} titulo={progresso === numTasks ? '100%' : ((100*progresso)/numTasks)}/>
          </Grid>

          <Grid item={true} xs={12} sm={3}>
            <MyCard className={classes.tabs}>
              <FullWidthTab 
                questoes={
                  respostaAluno.length !== 0 ? 
                  questoes : 0
                }
                questaoACorrigir={aCorrigirQuestao}
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
