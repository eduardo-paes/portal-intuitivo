import React, {useState, useEffect} from 'react';
import api from '../../api';

import { MyContainer, CreateButton } from "../../assets/styles/styledComponents";
import { Grid } from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';
import { ContentTable } from '../../components';
// import {TextEditor} from "../../components"

const useStyles = makeStyles((theme) => ({
  buttons: {
      marginTop: theme.spacing(2),
      margin: theme.spacing(1)
  },
  root: {
      flexGrow: 1
  },
  group: {
      textAlign: "center"
  }
}));

function ContentInsert () {

  const classes = useStyles();

  const [content, setContent] = useState({
    conteudos: []
  })

  useEffect(() => {
      let unmounted = false;
      async function fetchAPI () {
          let response = await api.listarConteudos();

          if (!unmounted) {
              setContent({ conteudos: response.data.data })
          }
      }
      fetchAPI();
      return () => {unmounted = true};
  }, [content]);

  const {conteudos} = content;

  return (
    <MyContainer>
      <header>
          <Grid container={true} className={classes.root} spacing={2}>
              <Grid item={true} xs={12} sm={9}>
                  <h1 className="heading-page">Conteúdos Disciplinares</h1>
              </Grid>

              <Grid item={true} xs={12} sm={3}>
                  <CreateButton title="Inserir Conteúdo" url="/controle-conteudo/create"/>
              </Grid>
              <Grid item={true} xs={12} sm={12}>
                <ContentTable data={conteudos}/>
              </Grid>
          </Grid>
      </header>
    </MyContainer>
  );
};

export default ContentInsert;
