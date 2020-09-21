import React, { useEffect, useState } from "react";
import { GeneralTitle, GeneralSubtitle, MyContainer } from "../../assets/styles/styledComponents"
import { Button, Grid } from "@material-ui/core";
import SchoolIcon from '@material-ui/icons/School';
import api from '../../api'

export default function Classroom (props) {
  const [classLink, setClassLink] = useState('')

  async function fetchClassLinkAPI() {
      let response = await api.listarClassLink();
      let value = response.data.data;
      if (value.length) {
        setClassLink(value[0].aulaLink);
      }
  }

  useEffect(() => {
    fetchClassLinkAPI();
  }, []);

  return (
    <MyContainer>
      <section id="classroomHeader">
        <Grid container={true} spacing={1}>
          <Grid item={true} xs={12} sm={12}>
            <GeneralTitle id="classroomTitle">Sala de Aula</GeneralTitle>
          </Grid>
          <Grid item={true} xs={12} sm={12}>
            <GeneralSubtitle id="classroomSubTitle">Bora estudar?</GeneralSubtitle>
          </Grid>
        </Grid>
      </section>

      <section id="classroomMain">
        <Grid container={true} justify="center" spacing={1}>
          <Grid item={true} xs={12} sm={9}>
            <p id="generalClassParagraph">Para acessar ao link da aula ao vivo, click no botão ao lado e você será redirecionado para a sala de aula.</p>
          </Grid>
          <Grid item={true} xs={12} sm={3} style={{ textAlign: "center"}}>
            <Button color="primary" variant="outlined" onClick={() => { window.open("https://" + classLink,'_blank') }} startIcon={<SchoolIcon />}>Participar</Button>
          </Grid>
        </Grid>
      </section>
    </MyContainer>
  );
};
