import React, { useState, useContext } from 'react'
import { Link, useHistory, withRouter } from 'react-router-dom';
import { StoreContext } from "../../utils"
import api from '../../api'

// -- Styles / Componentes gráficos
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles, useTheme, Grid } from '@material-ui/core';
import { red } from '@material-ui/core/colors';

import { AddButton, MyTextField, MyContainer, MyTypography, LoginCard } from "../../assets/styles/styledComponents"
import logo from "../../assets/images/LoginLogo.png"
import './styles.css'

// -- Style Classes
const useStyles = makeStyles(theme => ({
    logo: {
        alignSelf: "center",
        height: "100%",
        width: "100%",
    },
    forgotButton: {
        color: red[500],
        padding: "5% 0 3%",
        marginTop: "3%"
    },
    textField: {
        marginTop: "1.5rem",
    },
    smLogo: {
        alignSelf: "center",
        height: "100%",
        width: "100%",
        marginTop: "1rem",
        marginBottom: "1rem",
    },
    smLoginForm: {
        marginTop: "3rem",
        marginBottom: "2rem",
    }
}));

// -- Dados iniciais
function initialState() {
    return {email: "", senha: ""}
}

function Login() {
    const classes = useStyles();
    const theme = useTheme();
    const smScreen = useMediaQuery(theme.breakpoints.down('xs'));
    const { setToken } = useContext(StoreContext)
    const history = useHistory();
    const [usuario, setUsuario] = useState(initialState);
    
    async function authenticateUser(event) {
        event.preventDefault();

        try {
            const response = await api.confirmarUsuario(usuario);
            const value = response.data;
    
            if (value.success) {
                setToken(value.data);
                return history.push('/');
            }
        } catch (error) {
            window.alert('Usuário ou senha inválido');
        }
    }

    // Função para pegar os valores do formulário
    function handleChange(event) {
        const {name, value} = event.target;
        setUsuario(preValue => ({
            ...preValue,
            [name]: value
        }));
    }

    return (
        <main id="loginScreen">
            <MyContainer>
                <Grid container={true} justify="center">
                    <Grid item={true} xl={5} lg={5} md={6} sm={9} xs={12}>
                        <LoginCard>
                            <section id="loginHeader">
                                <img className={smScreen ? classes.smLogo : classes.logo} src={logo} alt="Logo"/>
                                <MyTypography align="center" variant="h5">Login</MyTypography>
                            </section>

                            <form>
                                <section id="loginForm" className={smScreen ? classes.smLoginForm : 'none'}>
                                    <MyTextField
                                        id="emailField"
                                        label="E-mail"
                                        variant="outlined"
                                        name="email"
                                        type="email"
                                        className={classes.textField}
                                        value={usuario.email}
                                        onChange={handleChange}/>

                                    <MyTextField
                                        id="passwordField"
                                        label="Senha"
                                        name="senha"
                                        type="password"
                                        className={classes.textField}
                                        value={usuario.senha}
                                        onChange={handleChange}
                                        variant="outlined"/>
                                </section>

                                <section id="loginFooter" className={classes.groupButtons}>
                                    <Link to="/" style={{ textDecoration: 'none' }}>
                                        <p className={classes.forgotButton}>Esqueceu a senha?</p>
                                    </Link>
                                    <AddButton
                                        size="large"
                                        variant="contained"
                                        color="primary"
                                        onClick={authenticateUser}>Entrar</AddButton>
                                </section>
                            </form>
                        </LoginCard>
                    </Grid>
                </Grid>
            </MyContainer>
        </main>
    );
}

export default withRouter(Login);