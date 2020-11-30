import React, { useState, useEffect, useContext } from 'react';
import api from '../../api';
import { GeneralTitle, MyContainer } from '../../assets/styles/styledComponents';
import { SubjectAccordion } from "../../components"
import { StoreContext } from '../../utils';

const colors = ["#eb7120", "#94c93d", "#a283bc", "#fdc504"]

export default function TeacherAnalysis() {
  const [data, setData] = useState([]);
  const { token } = useContext(StoreContext);
  const disciplinas = token.disciplina;

  async function gerarAnalise() {
    const res = await api.gerarAnaliseProfessor('5f31566b2c79ee17244a7327');
    console.log(res.data.data);
  }

  useEffect(() => {
    const abortController = new AbortController();
    gerarAnalise();
    return abortController.abort();
  }, [data]);
  
  /*
    TODO: 
     - Recebe dados do controller e salva em data;
     - Faz loop na interface retornando um acordeão por disciplina
  */

  return (
    <MyContainer>
      <GeneralTitle>Desempenho das Turmas</GeneralTitle>

      <SubjectAccordion 
        disciplina="História" 
        color={colors[0]} 
        media="79.1"
        melhorAluno="Maria Joaquina"
        piorAluno="Cirilo da Silva"
        melhorTopico="Revolução Francesa"
        piorTopico="Brasil Colônia"
      />
      
    </MyContainer>
  );
}