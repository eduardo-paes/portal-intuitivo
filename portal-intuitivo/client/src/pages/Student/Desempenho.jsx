import React from "react";
import { MyContainer } from "../../assets/styles/styledComponents"
import { Typography } from "@material-ui/core";

export default function Desempenho (props) {
  return (
    <MyContainer id="studentPageContainer">
      <Typography id="libraryTitle" variant="h4">Desempenho</Typography>
      <Typography id="librarySubTitle" variant="h6">Material Estudado</Typography>
    </MyContainer>
  );
};
