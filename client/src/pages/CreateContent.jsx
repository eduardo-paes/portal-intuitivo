import React from "react";
import {MyContainer} from "../styles/styledComponents"
import {TextEditor} from "../components"

const CreateContet = props => {
  return (
    <MyContainer>
      <h1 className="heading-page">Criar Conteúdo</h1>
      <TextEditor/>
    </MyContainer>
  );
};

export default CreateContet;
