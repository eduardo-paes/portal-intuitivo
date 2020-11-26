import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../utils";
import api from '../../api'

import { MyContainer, CreateButton, GeneralTitle } from "../../assets/styles/styledComponents";
import { ContentTable, PDFPreviewDialog } from '../../components';

export default function ContentList () {
  const { token } = useContext(StoreContext);
  const disciplinas = token.disciplina;

  const [content, setContent] = useState([])
  const [auxContent, setAuxContent] = useState([])

  const [mount, setMount] = useState({
    isMounting: true,
    wasChanged: false
  })
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [id, setId] = useState('');
  
  const [filterDialog, setFilterDialog] = useState(false);
  const [filter, setFilter] = useState({
    area: "",
    disciplinaID: "",
    numeracao: ""
  });

  async function fetchConteudoAPI() {
    if (disciplinas.length) {
      var arrayAux = [];
      
      disciplinas.forEach(async item => {
          const response = await api.listarConteudoPorDisciplina(item.disciplinaID);
          const value = response.data;

          if (value.success) {
            if (arrayAux.length) {
              arrayAux = arrayAux.concat(value.data);
            } else {
              arrayAux = value.data;
            }
            setContent(arrayAux);
          }
      });
    } 
    
    else {
        var firstSubject = await api.listarDisciplinas();
        firstSubject = firstSubject.data.data[0];
        setAuxContent(firstSubject._id);

        const response = await api.listarConteudoPorDisciplina(firstSubject._id);
        if (response.data.success) {
          setContent(response.data.data);
        }
    }
  }

  // -- Carrega os Tópicos existentes no banco
  useEffect(() => {
    const abortController = new AbortController();

    // Carregamento inicial
    if (mount.isMounting) {
      fetchConteudoAPI();
      setMount(preValue => ({...preValue, isMounting: false}))
    }

    // Carregamento após cada mudança
    if (mount.wasChanged) {
      fetchConteudoAPI();
      setMount(preValue => ({...preValue, wasChanged: false}))
    }
    return abortController.abort();
    // eslint-disable-next-line
  }, [mount]);

  // -- Carrega tabela conforme disciplina selecionada no filtro
  useEffect(() => {
    const abortController = new AbortController();

    if (!mount.isMounting) {
      async function fetchContentByFilter(disciplinaID) {
          const response = await api.listarConteudoPorDisciplina(disciplinaID);
          const value = response.data;
          setContent(value.data);
      }
  
      if (filter.disciplinaID !== '') {
        fetchContentByFilter(filter.disciplinaID);
      }
      else if (auxContent !== '') {
        fetchContentByFilter(auxContent);
      }
    }

    return abortController.abort();
    // eslint-disable-next-line
}, [filter])

  return (
    <MyContainer>
      
      <section id="cabecalhoConteudo">
        <GeneralTitle>Conteúdos Disciplinares</GeneralTitle>
      </section>

      <section id="tabelaConteudo">
        <ContentTable 
          data={content} 
          open={open} 
          setOpen={setOpen} 
          setTitulo={setTitulo} 
          setId={setId}
          filterDialog={filterDialog}
          setFilterDialog={setFilterDialog}
          setMount={setMount}
          filter={filter}
          setFilter={setFilter}
        />

        <PDFPreviewDialog 
          conteudo={id}
          topico={titulo}
          open={open}
          setOpen={setOpen}
        />
      </section>

      <section id="rodapeConteudo">
        <div className="create-button">
          <CreateButton title="Inserir Conteúdo" url="/controle-conteudo/create"/>
        </div>
      </section>
    
    </MyContainer>
  );
};