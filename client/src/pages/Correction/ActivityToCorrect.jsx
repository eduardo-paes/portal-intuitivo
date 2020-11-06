import React, { useEffect, useState } from "react";

import api from "../../api";

import { MyContainer, MyCard, MyCardContent, GeneralTitle } from "../../assets/styles/styledComponents"
import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails, Avatar, TextField, IconButton } from "@material-ui/core";
import { DiscreteSlider, FullWidthTab, WirisIframe, LinearProgressBar } from "../../components";
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddCommentIcon from '@material-ui/icons/AddComment';
import RateReviewIcon from '@material-ui/icons/RateReview';

// -- Estilos locais
const useStyles = makeStyles((theme) => ({
  
  accordion: {
    marginTop: '1rem',
    minHeight: "15rem",
  },

  accordionReturns: {
    padding: '0.5rem'
  },

  card: {
    marginTop: '1rem',
    minHeight: 400,
    padding: '1rem'
  },
  
  comment: {
    marginTop: '1rem',
    marginBottom: '2rem',
    width: '100%'
  },
  
  commentChanged: {
    marginTop: '1rem',
    marginBottom: '2rem',
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
  
  const activityID = props.match.params.atividadeID;
  const classes = useStyles();
  
  const [ wasLoaded, setWasLoaded ] = useState(false);
  const [ flag, setFlag ] = useState(false);
  const [ indice, setIndice ] = useState(0);

  const [ listarPorAluno, setListarPorAluno ] = useState(false);
  const [ respostaAluno, setRespostaAluno ] = useState([]);
  const [ alunos, setAlunos ] = useState([]);
  const [ questoes, setQuestoes ] = useState([]);
  const [ comment, setComment ] = useState('');

  const [ progresso, setProgresso ] = useState(0);
  const [ progressoAluno, setProgressoAluno ] = useState([]);
  const [ numTasks, setNumTasks ] = useState(0);
  const [ aCorrigirQuestao, setACorrigirQuestao ] = useState([]);

  async function pegarRespostasAluno(atividadeID) {
    const response = await api.listarRAPorAtividadeID(atividadeID);
    
    if (response.data.success) {
      response.data.data.sort(function(a,b) {
        if (a.alunoID.nome > b.alunoID.nome) return 1;
        else if (a.alunoID.nome < b.alunoID.nome) return -1;
        return 0;
      });
      setRespostaAluno(response.data.data);
    };
    setWasLoaded(true)
  }

  async function listarQuestoes() {
    let aux = [];
    if (respostaAluno.length !== 0) {
      respostaAluno[0].atividadeID.questoes.map( async (row, index) => {
        if (row.questaoID.tipoResposta === 'discursiva') {
          const { _id, enunciado, resposta, padraoResposta, tipoResposta, corrigido } = row.questaoID;
          aux.push({ _id, enunciado, resposta, padraoResposta, tipoResposta, corrigido });
        }
        
      })
      setQuestoes(aux);
    }
  }
  
  function listarAlunos() {
    let aux = [];
    if (respostaAluno.length !== 0) {
      respostaAluno.map( async (row, index) => {
        const { _id, nome } = row.alunoID;
        const { corrigido } = row;
        if(!row.respostaQuestaoIDs.find(element => element.corrigido !== true)) {
          let novaResposta = row;
          novaResposta.corrigido = true;
          await api.atualizarRespostaAluno(row._id, novaResposta);
        };
        aux.push({_id, nome, corrigido});
      })
      setAlunos(aux);
    }
  }

  function calcularProgressoAluno () {
    let aux = respostaAluno.map(row => {
      return row.respostaQuestaoIDs.filter(item => {
        return item.corrigido === false;
      })
    });
    console.log(aux);
    setProgressoAluno(aux);

  }

  function calcularProgressoGeral (progressoAluno) {
    
    let aux = 0;
    let corrigidos = 0;
    for (let index = 0; index < progressoAluno.length; ++index) {
      aux = aux + progressoAluno[index].length;
      console.log(aux);
      console.log(corrigidos);
      for (let i = 0; i < progressoAluno[index].length; ++i) {
        if(progressoAluno[index][i].corrigido === true) corrigidos = corrigidos + 1;
      }
    }


    // progressoAluno.map((row) => {
    //   setNumTasks(numTasks + row.length);
    //   row.forEach(element => {
    //     if (element.corrigido === true) setProgresso(progresso + 1);
    //   });
    //   return null;
    // })
    
    // respostaAluno.forEach((item, index) => {
    //   item.respostaQuestaoIDs.map((row, index) => {
      //     if (row.corrigido !== true) {
        //       setNumTasks(numTasks + 1);
        //       let aux = [];
        //       aux.push(true);
        //       setACorrigirQuestao(aux);
        //     }
        //   })
        //   setProgresso(questoes.length - aCorrigirQuestao);
        // });
      }
      
  useEffect(() => {
    pegarRespostasAluno(activityID);
    listarAlunos();
    listarQuestoes();
    // eslint-disable-next-line
  }, [wasLoaded])
  
  useEffect(() => {
    calcularProgressoAluno();
    calcularProgressoGeral(progressoAluno);
    // eslint-disable-next-line
  }, [])

  function retornarRespostaDiscursiva(defaultValue, resposta, id, comentario) {
    
    async function adicionandoComentario() {
      const response = await api.encRespostaQuestaoPorID(id);
      let novaResposta = response.data.data;
      novaResposta.comentario = comment;
      await api.atualizarRespostaQuestao(id, novaResposta);
      setFlag(false);
    }
  
    function handleChange(event) {
      const { value } = event.target;
      setComment(value);
      setFlag(true);
    }

    return (
      <Grid container> 
        <Grid item={true} align="center" xs={12} lg={12} sm={12}>
          <TextField
            className={classes.discursiveAnswer}
            disabled={true}
            multiline
            value={resposta}
          />
        </Grid>
        <Grid item align='left' xs={flag ? 11 : 12} lg={flag ? 11 : 12} sm={flag ? 11 : 12}>
          <TextField 
            className={flag ? classes.commentChanged : classes.comment}
            multiline
            label='Comentário'
            onChange={handleChange}
            defaultValue={comentario ? comentario : ''}
          />
        </Grid>
        <Grid item align='left' xs={1} lg={1} sm={1}>
          {
            flag ?
              <IconButton size='medium' className={classes.commentIcon} color='primary' onClick={adicionandoComentario}>
                {
                  comentario 
                  ? <RateReviewIcon />
                  : <AddCommentIcon />
                }
              </IconButton>
            : null  
          }
        </Grid>  
        <Grid item align='center' xs={12} lg={12} sm={12}>
          <DiscreteSlider respostaQuestaoID={id} defaultValue={defaultValue} setProgresso={setProgresso} progresso={progresso} setWasLoaded={setWasLoaded}/>
        </Grid>
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
                  <WirisIframe text={questoes[indice].enunciado}/>
                </Grid>
              </MyCardContent>
            </MyCard>
          </Grid>
  
          <Grid item={true} xs={12} sm={5} className={classes.accordion}>
            {
              respostaAluno.length !== 0 ? 
              respostaAluno.map((row, index) => {
                return (
                  <Accordion key={index} className={classes.accordionReturns}>
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
              <Accordion key={index} className={classes.accordionReturns}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                >
                  <Typography>{`Questão ${index+1}`}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={5}>
                    <Grid item sm={6}>
                      <Grid item={true} align="center">
                        <WirisIframe text={questoes[index].enunciado}/>
                      </Grid>
                    </Grid>
                    <Grid item sm={6}>
                      <Grid item={true} align="center">
                        { 
                          retornarRespostaDiscursiva(
                            respostaAluno[indice].respostaQuestaoIDs[index].nota, 
                            respostaAluno[indice].respostaQuestaoIDs[index].resposta, 
                            respostaAluno[indice].respostaQuestaoIDs[index]._id, 
                            respostaAluno[indice].respostaQuestaoIDs[index].comentario
                          ) 
                        }
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

      <section id="areaDeCorrecao">
        <Grid container={true} spacing={2}>

          <Grid item={true} xs={12} sm={12}>
            <LinearProgressBar 
              max={numTasks} 
              progresso={100} 
              titulo={
                wasLoaded ?
                  progresso === numTasks
                  ? '100%' 
                  : numTasks === 0 
                    ? '0%' 
                    : ((100*progresso)/numTasks) + '%'
                : '0%'  
              }
              wasLoaded={wasLoaded}
            />
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
                progressoAluno={progressoAluno}
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
