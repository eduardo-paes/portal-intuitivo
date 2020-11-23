import React, { useState, useEffect } from 'react';
import { GeneralTitle, MyContainer } from '../../assets/styles/styledComponents';
import { SubjectAccordion } from "../../components"

const colors = ["#eb7120", "#94c93d", "#a283bc", "#fdc504"]

export default function TeacherAnalysis() {
  const [data, setData] = useState([]);

  useEffect(() => {
    /*
      TODO: 
      - Pega dados do banco e saval em data
    */
  }, []);
  
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