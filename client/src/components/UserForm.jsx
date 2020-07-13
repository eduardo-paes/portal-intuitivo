import React from 'react'
import {Link} from 'react-router-dom'
import {AddButton, DeleteButton, MyTextField, MyContainer} from "../styles/styledComponents"
import MenuItem from '@material-ui/core/MenuItem';

function UserForm (props) {
    const {data, handleChange, onSubmit, typeForm, edit} = props;
    const {nome, email, acesso, senha, erros} = data;

    return (
        <MyContainer>
            <h1 className="heading-page">{typeForm} Usuário</h1>

            <MyTextField
                id="outlined-basic"
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
                id="outlined-basic"
                label="E-mail"
                variant="outlined"
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
                helperText={erros.email}
                error={erros.email ? true : false}/>

            <MyTextField
                id="outlined-select"
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
                id="outlined-uncontrolled"
                label="Senha"
                name="senha"
                type="password"
                value={senha}
                onChange={handleChange}
                variant="outlined"
                InputLabelProps={edit && {shrink: true}}
                helperText={erros.senha}
                error={erros.senha ? true : false}/>

            <div className="group-buttons">
                <AddButton onClick={onSubmit}>{typeForm}</AddButton>
                <Link to="/controle-usuario/list">
                    <DeleteButton>Cancelar</DeleteButton>
                </Link>
            </div>
        </MyContainer>
    )
}

export default UserForm;