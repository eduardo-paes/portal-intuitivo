import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Avatar, Grid } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

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
  const { aCorrigir, alunos, questoes, setIndice } = props;
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setIndice(newValue);
  };

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
            if (aCorrigir[index] === true) return <Tab label={"Questão " + ( index + 1 )} {...a11yProps(0)} />
            return (
              <Tab label={
                <Grid container justify='center' alignItems='center'>
                  <Grid sm={3}>
                    <CheckIcon className={classes.check}/>
                    {/* <CheckCircleIcon className={classes.check} fontSize='large'/> */}
                  </Grid>
                  <Grid sm={9}>
                    {"Questão " + ( index + 1 )}
                  </Grid>
                </Grid>
              } {...a11yProps(index)}/>
            )
          }) :
          alunos !== 0 && alunos !== undefined ?
          alunos.map((row, index) => {
            return ( <Tab label={
              <Grid container justify='center' alignItems='center'>
                <Grid sm={3}>
                  <Avatar className={row.corrigido === true ? classes.avatar : ''} sizes="small" src={`http://localhost:5000/uploads/profile/${row._id}.jpeg`} alt="Preview"/>
                </Grid>
                <Grid sm={9}>
                  {row.nome}
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
