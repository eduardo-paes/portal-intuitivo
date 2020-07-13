import React, {useState} from 'react'
import {DeleteButton, AddButton, MyTextField, MyContainer, MyTypography, MyCardContent} from "../styles/styledComponents"
import {Card} from '@material-ui/core';
import {Link} from 'react-router-dom'
// import api from '../api'



function Login() {
    const [usuario, setUsuario] = useState({email: "", senha: ""})
    const [url, setURL] = useState("/controle-usuario/")

    function handleChange(event) {
        const {name, value} = event.target;
        setUsuario(preValue => ({
            ...preValue,
            [name]: value
        }));
    }

    function onSubmit(event) {
        console.log(usuario);
    }

    return (
        <MyContainer maxWidth="sm">

            <Card>
                <MyCardContent>
                <MyTypography align="center" variant="h4">Login</MyTypography>
                <MyTextField
                    id="outlined-basic"
                    label="E-mail"
                    variant="outlined"
                    name="email"
                    type="email"
                    value={usuario.email}
                    onChange={handleChange}/>

                <MyTextField
                    id="outlined-uncontrolled"
                    label="Senha"
                    name="senha"
                    type="password"
                    value={usuario.senha}
                    onChange={handleChange}
                    variant="outlined"/>

                <div className="group-buttons">
                    <DeleteButton variant="contained" color="secondary">Cancelar</DeleteButton>
                    <Link to={url}>
                        <AddButton variant="contained" color="primary" onClick={onSubmit}>Entrar</AddButton>
                    </Link>
                </div>
                </MyCardContent>
            </Card>

        </MyContainer>
    );
}

export default Login;