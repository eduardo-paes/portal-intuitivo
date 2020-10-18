import React, { useState } from "react";

import { MyContainer } from "../../assets/styles/styledComponents"
import { makeStyles, Grid } from '@material-ui/core/styles';
import { useEffect } from "react";


// -- Estilos locais
const useStyles = makeStyles((theme) => ({

}));

export default function EssayCorrection (props) {
  const classes = useStyles();
  const essayID = props.match.params.id;

  useEffect(() => {
    const abortController = new AbortController();
    console.log(essayID);
    return abortController.abort();
    // eslint-disable-next-line
  },[]);

  return (
    <MyContainer id="studentPageContainer">

    </MyContainer>
  );
};
