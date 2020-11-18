import React from 'react';
import { GeneralSubtitle, GeneralText, GeneralTitle, MyContainer } from '../../assets/styles/styledComponents';
import { SubjectAccordion } from "../../components"

const colors = ["#eb7120", "#94c93d", "#a283bc", "#fdc504"]

export default function TeacherAnalysis() {
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