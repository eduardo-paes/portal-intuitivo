import React, { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { EssayVerticalTab } from '..';

import './styles.css'

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function EssayFullWidthTabs(props) {
  const { data } = props;
  const [value, setValue] = useState(0);
  const theme = useTheme();

  return (
    <>
      <AppBar position="static" color="primary">
        <Tabs
          value={value}
          onChange={() => setValue(value)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Alunos" {...a11yProps(0)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={() => setValue(value)}
      >
        <EssayVerticalTab data={data} />
      </SwipeableViews>
    </>
  );
}
