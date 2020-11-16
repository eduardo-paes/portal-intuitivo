import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Avatar, Grid, Typography } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  avatar: {
    border: '3px solid #94c93d'
  },

  check: {
    color: '#94c93d',
    fontSize: '300%'
  },

  progressText: {
    fontSize: '0.7rem',
    fontWeight: "lighter"
  },

  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
  },

  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    width: '100%'
  },

}));

export default function VerticalTabs(props) {
  const { aCorrigir, alunos, questoes, setIndice, progressoAluno } = props;
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (questoes !== 0 && questoes !== undefined) {
      setIndice(questoes[newValue].index);
    } else {
      setIndice(newValue);
    }
  };

  const calcularPendentes = (array, indice) => {
    var total = 0;
    var corrigidos = 0;
    for (let index = 0; index < array.length; index++) {
      ++total;
      if (array[index][indice] === false) ++corrigidos;
    }
    return `${corrigidos} de ${total}`
  }

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        {
          questoes !== 0 && questoes !== undefined ?
          questoes.map((row, index) => {
            return (
              <Tab label={
                <Grid container justify='center' alignItems='center' spacing={2}>
                  { 
                    aCorrigir.length !== 0
                    ?
                      aCorrigir[row.index] === false
                      ? <Grid xs={3}>
                          <CheckIcon className={classes.check}/>
                        </Grid>
                      : null
                    : null
                  }
                  <Grid xs={9}>
                    {"Questão " + ( questoes[index].index + 1 )}
                    <Typography 
                      className={classes.progressText}
                    > {calcularPendentes(aCorrigir, questoes[index].index)}
                    </Typography>
                  </Grid>
                </Grid>
              } {...a11yProps(index)}/>
            )
          }) :
          alunos !== 0 && alunos !== undefined ?
          alunos.map((row, index) => {
            return ( <Tab label={
              <Grid container justify='center' alignItems='center'>
                <Grid xs={3}>
                  <Avatar sizes="small" src={`http://localhost:5000/uploads/profile/${row._id}.jpeg`} alt="Preview"/>
                </Grid>
                <Grid xs={9}>
                  <Typography>{row.nome}</Typography>
                  <Typography className={classes.progressText}>{`${progressoAluno[index].filter(element => { return element.corrigido === true }).length} de ${progressoAluno[index].length}`}</Typography>
                </Grid>
              </Grid>
            } {...a11yProps(index)}/> )
          }) :
          <Tab label={"Questão 1"} {...a11yProps(0)} />
        }
      </Tabs>
    </div>
  );
}
