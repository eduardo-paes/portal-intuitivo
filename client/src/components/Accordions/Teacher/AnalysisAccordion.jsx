import React, {useState} from 'react';
import { GeneralSubtitle, GeneralText } from '../../../assets/styles/styledComponents';
import { makeStyles, Accordion, AccordionSummary, AccordionDetails, Grid, Divider } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularStatic from '../../ProgressBar/CircularStatic';

// -- Estilos locais
const useStyles = makeStyles((theme) => ({
    accordionContainer: {
        padding: '0 0.5rem',
        textAlign: "center",
    },
    areaName: {
        fontSize: '0.9rem',
        textAlign: "center",
        marginTop: "0.1rem"
    },
    avgGrade: {
        fontSize: '1.5rem',
    },
    avgGradeGrid: {
        textAlign: "center",
    },
    container: {
        margin: "0.7rem 0",
    },
    divider: {
        color: "#606161",
        margin: "0.7rem 0",
        textAlign: "center"
    },
    gridTitle: {
        fontSize: '1.3rem',
        marginBottom: "1rem",
        [theme.breakpoints.down('sm')]: {
            marginTop: "1rem",
        }
    },
    gridSubtitle: {
        fontSize: '0.9rem',
        textAlign: "left",
        marginTop: "0.1rem",
    },
    itemGridRank: {
        display: 'flex',
        alignItems: 'center',
    },
    leftTitle: {
        fontSize: '1.3rem',
        textAlign: "left",
        marginTop: "0.6rem"
    },
    rightTitle: {
        fontSize: '1.2rem',
        fontWeight: '500'
    },
    rankContainer: {
        "&:hover": {
            background: "#eeeeee"
        },
        padding: "0 0.2rem",
    },
    subjectResults: {
        paddingLeft: "1.2rem",
        [theme.breakpoints.down('sm')]: {
            marginTop: "0",
        }
    }
}));

const StudentRank = (props) => {
    const {aluno, best, classes, nota, isLast} = props;
    var title = best ? 'Melhor Desempenho' : 'Pior Desempenho';

    return (
        <div className={classes.rankContainer}>
            <Grid container className={classes.container}>
                <Grid item xs={8}className={classes.itemGridRank}>
                    <div>
                        <GeneralText className={classes.leftTitle}>{title}</GeneralText>
                        <GeneralText className={classes.gridSubtitle}>{aluno}</GeneralText>
                    </div>
                </Grid>
                <Grid item xs={4} className={classes.itemGridRank}>
                    <div style={{ paddingLeft: "1rem" }}>
                        <GeneralText className={classes.avgGrade}>{nota}</GeneralText>
                        <GeneralText>Nota Média</GeneralText>
                    </div>
                </Grid>
            </Grid>
            {/* <Divider hidden={isLast} variant="fullWidth" className={classes.divider} /> */}
        </div>
    )
}

const ContentRank = (props) => {
    const {best, classes, conteudo, isLast, nota, parte, total, setWasLoaded, wasLoaded} = props;
    var title = best ? 'Melhor Desempenho' : 'Pior Desempenho';

    return (
        <div className={classes.rankContainer}>
            <Grid container className={classes.container}>
                <Grid item xs={12} sm={6}>
                    <GeneralText className={classes.leftTitle}>{title}</GeneralText>
                    <GeneralText className={classes.gridSubtitle}>{conteudo}</GeneralText>
                </Grid>
                <Grid item xs={6} sm={3} className={classes.itemGridRank}>
                    <div style={{ paddingLeft: "1rem" }}>
                        <GeneralText className={classes.avgGrade}>{nota}</GeneralText>
                        <GeneralText>Nota Média</GeneralText>
                    </div>
                </Grid>
                <Grid item xs={6} sm={3} className={classes.itemGridRank}>
                    <div className={classes.subjectResults}>
                        <CircularStatic wasLoaded={wasLoaded} setWasLoaded={setWasLoaded} numTasks={total} progresso={parte}/>
                        <GeneralText style={{fontSize: "0.8rem"}}>{parte}/{total}</GeneralText>
                        <GeneralText style={{fontSize: "0.8rem"}}>Estudado/Total</GeneralText>
                    </div>
                </Grid>
            </Grid>
            {/* <Divider hidden={isLast} variant="fullWidth" className={classes.divider} /> */}
        </div>
    )
}

export default function SubjectAccordion (props) {
    const classes = useStyles();
    const { color, disciplina, media, melhorAluno, piorAluno, melhorTopico, piorTopico } = props;
    const [wasLoaded, setWasLoaded] = useState(false);
  
    return (
      <Accordion style={{borderBottom: `0.2rem solid ${color}`}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          // onClick={() => initialYearLoad()}
          aria-controls="panel1a-content"
          id="panel3-settings">
          <GeneralSubtitle>{disciplina}</GeneralSubtitle>
        </AccordionSummary>
  
        <AccordionDetails>
            <Grid container spacing={1} className={classes.accordionContainer}>
                <Grid item xs={12} sm={2} className={classes.avgGradeGrid}>
                    <GeneralText className={classes.avgGrade}>{media}</GeneralText>
                    <GeneralText>Média Geral</GeneralText>
                </Grid>
                {/* <Grid item xs={1}>
                    <Divider variant="middle" orientation="vertical" className={classes.divider} />
                </Grid> */}
                
                <Grid item xs={12} sm={5}>
                    <GeneralText className={classes.gridTitle}>Aluno em Destaque</GeneralText>
                    <StudentRank aluno={melhorAluno} best={true} classes={classes} isLast={false} nota='91.0'/>
                    <StudentRank aluno={piorAluno} best={false} classes={classes} isLast={true} nota='67'/>
                </Grid>
                
                <Grid item xs={12} sm={5}>
                    <GeneralText className={classes.gridTitle}>Conteúdo em Destaque</GeneralText>
                    <ContentRank 
                        best={true}
                        classes={classes} 
                        conteudo={melhorTopico} 
                        isLast={false} 
                        nota='86.2' 
                        parte='37' 
                        total='42' 
                        setWasLoaded={setWasLoaded} 
                        wasLoaded={wasLoaded}
                    />
                    <ContentRank 
                        best={false}
                        classes={classes} 
                        conteudo={piorTopico} 
                        isLast={true} 
                        nota='65.8' 
                        parte='26' 
                        total='42' 
                        setWasLoaded={setWasLoaded} 
                        wasLoaded={wasLoaded}
                    />
                    
                </Grid>
                
                <Grid item xs={12} sm={4}>
                
                </Grid>
                
                <Grid item xs={12} sm={4}>
                
                </Grid>
                
                <Grid item xs={12} sm={4}>
                
                </Grid>
            </Grid>
        </AccordionDetails>
      </Accordion>
    );
  }
