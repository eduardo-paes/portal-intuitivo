import React from "react";
import { MyContainer } from "../../assets/styles/styledComponents"
import { Typography } from "@material-ui/core";

export default function Classroom (props) {
  return (
    <MyContainer>
      <Typography id="libraryTitle" variant="h4">Classroom</Typography>
      <Typography id="librarySubTitle" variant="h6">Link para aula ao vivo</Typography>
    </MyContainer>
  );
};
