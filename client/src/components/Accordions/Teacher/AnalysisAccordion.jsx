import React, {useState} from 'react';
import { GeneralSubtitle, GeneralText } from '../../../assets/styles/styledComponents';
import { Accordion, AccordionSummary, AccordionDetails, Grid, useTheme, useMediaQuery } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { GradeCard, StudentRank, ContentRank, FrequencyCard } from "./ContentContainers"
import { useStyles } from "./Styles"
import clsx from 'clsx';

const frequencyMessages = [
    {
        title: "Material de Estudo",
        message: "Relação entre a quantidade de tópicos completamente estudados pelos alunos e o total de materiais disponibilizados."
    },
    {
        title: "Videoaula",
        message: "Relação entre a quantidade de videoaulas completamente assistidas de cada tópico e total de videoaulas disponibilizadas."
    },
    {
        title: "Atividades",
        message: "Relação entre a quantidade de atividades concluídas de cada tópico e total de atividades programadas."
    },
]

const dataFrequency = [
    {
        parte: 17,
        total: 19,
        tooltip: "Estudados/Total",
        tip: "E/T"
    },
    {
        parte: 18,
        total: 19,
        tooltip: "Assistidos/Total",
        tip: "A/T"
    },
    {
        parte: 42,
        total: 50,
        tooltip: "Feitos/Total",
        tip: "F/T"
    },
]

export default function SubjectAccordion (props) {
    const classes = useStyles();
    const { color, disciplina, melhorAluno, piorAluno, melhorTopico, piorTopico } = props;
    const [wasLoaded, setWasLoaded] = useState(false);

    const theme = useTheme();
    const smScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
    return (
      <Accordion style={{borderBottom: `0.2rem solid ${color}`}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          // onClick={() => initialYearLoad()}
          aria-controls="panel1a-content"
          id="panel3-settings">
          <GeneralSubtitle style={{paddingLeft: "0.4rem"}}>{disciplina}</GeneralSubtitle>
        </AccordionSummary>
  
        <AccordionDetails>
            <Grid container className={classes.accordionContainer}>
                <Grid item xs={12} md={4} className={classes.avgGradeGrid}>
                    <GeneralText className={classes.gridTitle}>Resultados</GeneralText>
                    <GradeCard 
                        classes={classes}
                        media="79.1"
                        parte="101"    
                        total="132"   
                        setWasLoaded={setWasLoaded} 
                        wasLoaded={wasLoaded} 
                    />
                </Grid>               
                
                <Grid item xs={12} md={4} className={smScreen ? classes.topDivider : classes.helper}>
                    <GeneralText className={classes.gridTitle}>Aluno em Destaque</GeneralText>
                    <StudentRank aluno={melhorAluno} best={true} classes={classes} isLast={false} nota='91.0'/>
                    <StudentRank aluno={piorAluno} best={false} classes={classes} isLast={true} nota='67'/>
                    <GeneralText className={clsx(classes.gradeText, classes.container)} style={{textAlign: "left", padding: "0 0.5rem"}}>Valores encontrado através de média simples, (soma das notas / número de atividades realizadas).</GeneralText>
                </Grid>
                
                <Grid item xs={12} md={4} className={smScreen ? classes.topDivider : classes.helper}>
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
                
                <Grid item xs={12} className={classes.topDivider} style={{marginTop: "1rem"}}>
                    <GeneralText className={classes.gridTitle} style={{marginTop: "1rem"}}>Engajamento da Turma</GeneralText>
                    <FrequencyCard 
                        classes={classes} 
                        messages={frequencyMessages}
                        setWasLoaded={setWasLoaded} 
                        wasLoaded={wasLoaded}
                        dataFrequency={dataFrequency}
                    />
                </Grid>
            </Grid>
        </AccordionDetails>
      </Accordion>
    );
  }
