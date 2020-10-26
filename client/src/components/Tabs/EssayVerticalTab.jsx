import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Tabs, Tab, Typography } from '@material-ui/core';
import { CorrectionPanel } from '..';
import { useEffect } from 'react';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    minHeight: 400,
  },
  tabs: {
    backgroundColor: "theme.palette.background.paper",
    borderRight: `1px solid ${theme.palette.divider}`,
    minWidth: 161
  },
}));

export default function EssayVerticalTabs(props) {
    const { data } = props;
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [alunoID, setAlunoID] = useState('');
    var flag = 1;

    useEffect(() => {
      const abortController = new AbortController();
      if (flag && data.length) {
        setAlunoID(data[0].alunoID._id);
        flag--;
      }
      // eslint-disable-next-line
      return abortController.abort();
    },[data]);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return (
      <div className={classes.root}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          indicatorColor="primary"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs"
          className={classes.tabs}
        >
          {
            (data) 
              ? data.map((row, index) => {
                return <Tab key={index} label={row.alunoID.nome} {...a11yProps(index)} onClick={() => setAlunoID(row.alunoID._id)}/>
              })
              : <Tab label={"Alunos"} {...a11yProps(0)} />
          } 
        </Tabs>
        {/* {
          data.length > 0 &&
          <CorrectionPanel redacaoID={data[0].redacaoID} alunoID={alunoID} />
        } */}
      </div >
    );
}