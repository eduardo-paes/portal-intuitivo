import React, { useContext } from 'react';
import { useEffect } from 'react';
import apis from '../../api';
import { GeneralTitle, MyContainer } from '../../assets/styles/styledComponents';
import { StoreContext } from "../../utils";

export default function StudentAnalysis() {

  const { token } = useContext(StoreContext)
  const alunoID = token.userID;
  console.log("Entrou")

  async function gerarAnalise() {
    const res = await apis.gerarAnaliseAluno(alunoID);
    console.log(res);
  }

  useEffect(() => {
    const abortController = new AbortController();
    gerarAnalise();
    return abortController.abort();
  }, [])

  return (
    <MyContainer>
      <GeneralTitle>Meu Desempenho</GeneralTitle>
    </MyContainer>
  );
}