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


//   async function calcularProgresso(id) {
//     const progressoEncontrado = await Progresso.find({topicoID: id});
//     progressoEncontrado.map((row) => { 
//         console.log("Teste 3");
//         const key = row.topicoID + '';
        
//         if (row.progresso.materialEstudo !== undefined) {
//             ++analise.frequencia.material.mTotal;
//             if (key === analise.topicos.melhor.tmID + '') {
//                 ++analise.topicos.melhor.tmTotal;
//                 if (row.progresso.materialEstudo === true) {
//                     ++analise.topicos.melhor.tmEstudado;
//                 }    
//             } 
//             if (key === analise.topicos.pior.tpID + '') {
//                 ++analise.topicos.pior.tpTotal;
//                 if (row.progresso.materialEstudo === true) ++analise.topicos.pior.tpEstudado;
//             }
//             if (row.progresso.materialEstudo === true) ++analise.frequencia.material.mEstudado;
//         } 

//         if (row.progresso.videoaula !== undefined) {
//             ++analise.frequencia.videoaula.vTotal;
//             if (key === analise.topicos.melhor.tmID + '') {
//                 ++analise.topicos.melhor.tmTotal;
//                 if (row.progresso.videoaula === true) ++analise.topicos.melhor.tmEstudado;
//             } 
//             if (key === analise.topicos.pior.tpID + '') {
//                 ++analise.topicos.pior.tpTotal;
//                 if (row.progresso.videoaula === true) ++analise.topicos.pior.tpEstudado;
//             }
//             if (row.progresso.videoaula === true) ++analise.frequencia.videoaula.vAssistido;
//         } 

//         if (row.progresso.exercicioFixacao !== undefined) {
//             ++analise.frequencia.atividade.aTotal;
//             if (key === analise.topicos.melhor.tmID + '') {
//                 ++analise.topicos.melhor.tmTotal;
//                 if (row.progresso.exercicioFixacao === true) ++analise.topicos.melhor.tmEstudado;
//             }
//             if (key === analise.topicos.pior.tpID + '') {
//                 ++analise.topicos.pior.tpTotal;
//                 if (row.progresso.exercicioFixacao === true) ++analise.topicos.pior.tpEstudado;
//             }
//             if (row.progresso.exercicioFixacao === true) ++analise.frequencia.atividade.aFeito;
//         }

//         if (row.progresso.exercicioRetomada !== undefined) {
//             ++analise.frequencia.atividade.aTotal;
//             if (key === analise.topicos.melhor.tmID + '') {
//                 ++analise.topicos.melhor.tmTotal;
//                 if (row.progresso.exercicioRetomada === true) ++analise.topicos.melhor.tmEstudado;
//             }
//             if (key === analise.topicos.pior.tpID + '') {
//                 ++analise.topicos.pior.tpTotal;
//                 if (row.progresso.exercicioRetomada === true) ++analise.topicos.pior.tpEstudado;
//             }
//             if (row.progresso.exercicioRetomada === true) ++analise.frequencia.atividade.aFeito;
//         }

//         if (row.progresso.exercicioAprofundamento !== undefined) {
//             ++analise.frequencia.atividade.aTotal;
//             if (key === analise.topicos.melhor.tmID + '') {
//                 ++analise.topicos.melhor.tmTotal;
//                 if (row.progresso.exercicioAprofundamento === true) ++analise.topicos.melhor.tmEstudado;
//             } 
//             if (key === analise.topicos.pior.tpID + '') {
//                 ++analise.topicos.pior.tpTotal;
//                 if (row.progresso.exercicioAprofundamento === true) ++analise.topicos.pior.tpEstudado;
//             }
//             if (row.progresso.exercicioAprofundamento === true) ++analise.frequencia.atividade.aFeito;
//         }
//     });
// }

  async function gerarAnalise() {
    const res = await api.gerarAnaliseProfessor('5f31566b2c79ee17244a7327');
    const { data, progresso } = res.data;
    progresso.map(async row => {
      const aux = await api.calcularProgresso(row, data.topicos.melhor.tmID, data.topicos.pior.tpID);
    });
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