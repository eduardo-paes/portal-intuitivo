import React, {useContext, useState} from "react";
import {StoreContext} from "../components"
import {TextEditor} from "../components"
import {Grid} from '@material-ui/core';
import {MyContainer, MyTextField} from "../styles/styledComponents"

function initialState() {
    return {
      disciplina: "", 
      topico: "", 
      semana: "", 
      conteudo: {}, 
      autor: ""
    }
}

// -- Outro modelo de conteúdo 
// return {
//   disciplina: "",
//   topico: "",
//   semana: "",
//   conteudo: '',
//   dataCriacao: new Date(),
//   publicado: false,
//   dataModificacao: new Date(),
//   autor: '' 
// }


function Exercises(props) {
    const {token} = useContext(StoreContext);
    const autor = {
      id: token.userID,
      nome: token.userName
    }

    console.log(autor);

    // -- Define principais constantes
    const [material, setMaterial] = useState(initialState);

    // -- Definição das Funções

    const onMaterialChange = (event) => {
        const {name, value} = event.target;
        setMaterial(preValue => ({
            ...preValue,
            [name]: value
        }));
    }

    return (
        <MyContainer>
            <h1 className="heading-page">Atividades</h1>

            <Grid container="container" spacing={1}>
                <Grid item={true} xs={12} sm={6}>
                    <MyTextField
                        id="outlined-basic"
                        label="Semana"
                        variant="outlined"
                        name="topico"
                        type="text"
                        value={material.topico}
                        onChange={onMaterialChange}/>
                </Grid>
                <Grid item={true} xs={12} sm={6}>
                    <MyTextField
                        id="outlined-basic"
                        label="Data"
                        variant="outlined"
                        name="topico"
                        type="text"
                        value={material.topico}
                        onChange={onMaterialChange}/>
                </Grid>
                <Grid item={true} xs={12}>
                    <MyTextField
                        id="outlined-basic"
                        label="Tópico"
                        variant="outlined"
                        name="topico"
                        type="text"
                        value={material.topico}
                        onChange={onMaterialChange}/>
                </Grid>
            </Grid>

            <TextEditor/>

        </MyContainer>
    );
};

export default Exercises;
