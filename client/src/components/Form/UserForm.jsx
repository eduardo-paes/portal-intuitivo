import React from 'react';
import { Link } from '../../../node_modules/react-router-dom'
import { AddButton, DeleteButton, MyAvatar, MyTextField, MyContainer, GeneralTitle } from "../../assets/styles/styledComponents"
import { MenuItem, Grid } from '@material-ui/core'

// Upload da Imagem do Perfil
import Upload from "../Upload/Upload";
import "./Styles/styleUserForm.css"

export default function UserForm (props) {
    const { data, setUsuario, onSubmit, typeForm, edit } = props;
    const { nome, email, acesso, senha, erros, url } = data;
    
    // Guarda o dado vindo do input
    async function handleChange (event) {
        const {name, value} = event.target;
        setUsuario(preValue => ({
            ...preValue,
            [name]: value
        }));
    }

    // Guarda o dado vindo do upload da imagem de perfil
    async function handleUpload (event) {
        const file = event.target.files[0];
        setUsuario(preValue => ({
            ...preValue,
            url: URL.createObjectURL(file),
            foto: file
        }));
    }

    return (
        <MyContainer>
            <section id="headerUserForm">
                <GeneralTitle>{typeForm} Usuário</GeneralTitle>
            </section>

            <section id="bodyUserForm">
                <Grid container={true} spacing={2} justify="center">
                    <Grid item={true} xl={8} xs={12} sm={9} className="uploadImage">
                        <MyAvatar src={url} alt="Preview"/>
                        <Upload onUpload={handleUpload} />
                    </Grid>

                    <Grid item={true} xl={8} xs={12} sm={9}>
                        <MyTextField
                            id="userNameInput"
                            label="Nome"
                            variant="outlined"
                            name="nome"
                            type="text"
                            value={nome}
                            autoFocus={true}
                            onChange={handleChange}
                            helperText={erros.nome}
                            error={erros.nome ? true : false}/>

                        <MyTextField
                            id="userEmailsInput"
                            label="E-mail"
                            variant="outlined"
                            name="email"
                            type="email"
                            value={email}
                            onChange={handleChange}
                            helperText={erros.email}
                            error={erros.email ? true : false}/>
                        
                        <MyTextField
                            id="userAccessInput"
                            select={true}
                            label="Acesso"
                            name="acesso"
                            type="text"
                            value={acesso}
                            onChange={handleChange}
                            variant="outlined"
                            helperText={erros.acesso}
                            error={erros.acesso ? true : false}>
                                <MenuItem value="Aluno">Aluno</MenuItem>
                                <MenuItem value="Professor">Professor</MenuItem>
                                <MenuItem value="Administrador">Administrador</MenuItem>
                        </MyTextField>

                        <MyTextField
                            id="userPasswordInput"
                            label="Senha"
                            variant="outlined"
                            name="senha"
                            type="password"
                            value={senha ? senha : ''}
                            onChange={handleChange}
                            helperText={erros.senha}
                            error={erros.senha ? true : false}
                            InputLabelProps={edit ? {shrink: true} : null}/>
                    </Grid>
                </Grid>
            </section>

            <section id="footerUserForm" className="group-buttons">
                <AddButton onClick={onSubmit}>{typeForm}</AddButton>
                <Link to="/controle-usuario/list" style={{ textDecoration: 'none' }}>
                    <DeleteButton>Cancelar</DeleteButton>
                </Link>
            </section>
        </MyContainer>
    )
}