import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Tabs, Tab, Typography } from '@material-ui/core';

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
        height: 360,
        fullWidth: true
    },
    tabs: {
        backgroundColor: "theme.palette.background.paper",
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));

export default function EssayVerticalTabs(props) {
    const { data } = props;
    const classes = useStyles();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                indicatorColor="primary"
                textColor="#606161"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs"
                className={classes.tabs}
            >
                {
                    (data) 
                        ? data.map((row, index) => {
                            return <Tab key={index} label={row.alunoID.nome} {...a11yProps(index)}/>
                        })
                        : <Tab label={"Alunos"} {...a11yProps(0)} />
                } 

            </Tabs>
                {
                    data.map((row, index) => {
                        return (
                            <TabPanel key={index} value={value} index={index}>
                                {row.alunoID.nome}
                                {/* <CorrectionPanel /> */}
                            </TabPanel>
                        )
                    })
                } 
        </div >
    );
}