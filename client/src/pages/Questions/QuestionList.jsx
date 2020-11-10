import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../utils";
import api from '../../api'

// -- Components
import { MyContainer, CreateButton, GeneralTitle } from "../../assets/styles/styledComponents"
import { QuestionTable, QuestionDialog } from "../../components"

// -- Styles
import "./ListStyles.css"

function QuestionInsert() {
    const { token } = useContext(StoreContext);
    const disciplinas = token.disciplina;
    const [questoes, setQuestoes] = useState([]);
    const [auxQuestion, setAuxQuestion] = useState('');
    const [questaoSelecionada, setQuestaoSelecionada] = useState('');
    const [filterDialog, setFilterDialog] = useState(false);
    const [filter, setFilter] = useState({
        disciplinaID: "",
        topicoID: "",
        tipo: "",
        tags: "",
    });
    const [hiddenDialog, setHiddenDialog] = useState(false);
    const [mount, setMount] = useState({
        isMounting: true,
        wasChanged: false
    })

    async function fetchQuestoesAPI() {
        if (disciplinas.length) {
            var arrayAux = [];
            
            disciplinas.forEach(async item => {
                const response = await api.listarQuestaoPorDisciplina(item.disciplinaID);
                const value = response.data;
      
                if (value.success) {
                  if (arrayAux.length) {
                    arrayAux = arrayAux.concat(value.data);
                  } else {
                    arrayAux = value.data;
                  }
                  setQuestoes(arrayAux);
                }
            });
          } 
          
          else {
              var firstSubject = await api.listarDisciplinas();
              firstSubject = firstSubject.data.data[0];
              setAuxQuestion(firstSubject._id);
      
              const response = await api.listarQuestaoPorDisciplina(firstSubject._id);
              if (response.data.success) {
                setQuestoes(response.data.data);
              }
          }
    }

    // -- Lista as questões do banco
    useEffect(() => {
        const abortController = new AbortController();
        if (mount.isMounting) {
            fetchQuestoesAPI()
            setMount(preValue => ({ ...preValue, isMounting:false }));
        }
        return abortController.abort();
    // eslint-disable-next-line
    }, []);

    // -- Lista as questões do banco
    useEffect(() => {
        const abortController = new AbortController();
        if (mount.wasChanged) {
            fetchQuestoesAPI()
            setMount(preValue => ({ ...preValue, wasChanged:false }));
        }
        return abortController.abort();
    }, [mount]);

    // -- Observa mudanças em questão selecionada
    useEffect(() => {
        setQuestaoSelecionada(questaoSelecionada)
    }, [questaoSelecionada]);

    // -- Carrega tabela conforme disciplina selecionada no filtro
    useEffect(() => {
        const abortController = new AbortController();
        if (!mount.isMounting) {
            async function fetchQuestionByFilter(disciplinaID) {
                const response = await api.listarQuestaoPorDisciplina(disciplinaID);
                const value = response.data;
                setQuestoes(value.data);
            }
        
            if (filter.disciplinaID !== '') {
                fetchQuestionByFilter(filter.disciplinaID);
            }

            else if (auxQuestion !== '') {
                fetchQuestionByFilter(auxQuestion);
            }
        }
        return abortController.abort();
        // eslint-disable-next-line
    }, [filter])

        return (
        <MyContainer>
            <section id="cabecalhoQuestao">
                <GeneralTitle>Banco de Questões</GeneralTitle>
            </section>

            <section id="tabelaQuestao">
                <QuestionTable 
                    data={questoes} 
                    setMount={setMount} 
                    setQuestion={setQuestaoSelecionada} 
                    filterDialog={filterDialog}
                    setFilterDialog={setFilterDialog}
                    setHidden={setHiddenDialog} 
                    activity={false}
                    filter={filter}
                    setFilter={setFilter}
                    tableSelection={false}/>

                <QuestionDialog 
                    enunciado={questaoSelecionada.enunciado}
                    tipoResposta={questaoSelecionada.tipoResposta}
                    padraoResposta={questaoSelecionada.padraoResposta}
                    resposta={questaoSelecionada.resposta}
                    open={hiddenDialog}
                    setOpen={setHiddenDialog}
                />
            </section>

            <section id="rodapeQuestao">
                <div className="create-button">
                    <CreateButton title="Inserir Questão" url="/controle-questoes/create"/>
                </div>
            </section>
        </MyContainer>
    );
};

export default QuestionInsert;