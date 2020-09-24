import React, {useState, useEffect} from 'react';
import api from '../../api';

import { MyContainer, CreateButton, GeneralTitle } from "../../assets/styles/styledComponents";
import { ContentTable, PDFPreviewDialog } from '../../components';

export default function ContentList () {
  const [content, setContent] = useState([])
  const [mount, setMount] = useState({
    isMounted: true,
    wasChanged: false
  })
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [id, setId] = useState('');
  const [filterDialog, setFilterDialog] = useState(false);

  async function fetchConteudoAPI() {
    const response = await api.listarConteudos();
    const value = response.data.data;
    setContent(value);
  }

  // -- Carrega os Tópicos existentes no banco
  useEffect(() => {
    const abortController = new AbortController();

    // Carregamento inicial
    if (mount.isMounted) {
      fetchConteudoAPI();
      setMount(preValue => ({...preValue, isMounted: false}))
    }

    // Carregamento após cada mudança
    if (mount.wasChanged) {
      fetchConteudoAPI();
      setMount(preValue => ({...preValue, wasChanged: false}))
    }
    return abortController.abort();
    // eslint-disable-next-line
  }, [mount]);

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
        />

        <PDFPreviewDialog 
          conteudo={`http://localhost:5000/uploads/content/${id}.pdf`}
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