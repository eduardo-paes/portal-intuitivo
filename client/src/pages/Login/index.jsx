import React, { useState, useEffect, useContext } from 'react'
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
    const [data, setData] = useState('');
    const error = 'Usuário ou senha inválido';

    // Função para pegar os valores do formulário
    function handleChange(event) {
        const {name, value} = event.target;
        setUsuario(preValue => ({
            ...preValue,
            [name]: value
        }));
    }
    
    // Valida se usuário está correto
    function validateLogin(usuario, data) {
        // Verifica se a senha está correta
        if (data.senha === usuario.senha) {
            return {
                token: {
                    userID: data._id,
                    userName: data.nome,
                    accessType: data.acesso,
                    nameImage: data.nomeArquivo
                }
            }
        }
        return { error };
    }

    // Puxa usuários do banco e aloca em data, caso seja encontrado
    async function fetchUserAPI() {
        // Procura e-mail do usuário no banco
        if (usuario.email) {
            const response = await api.encUsuarioPorEmail(usuario.email);
            const value = await response.data;
            
            // Caso usuário seja encontrado
            if (value.success) {
                setData(value.data);
            }
        }
    }

    // Escuta mudança em Data
    useEffect(() => {
        const abortController = new AbortController();
        if (data !== '') {
            // Valida se login está correto
            const { token, error } = validateLogin(usuario, data);
            // Se há token, leva o usuário para a página permitida
            if (token) {
                setToken(token);
                return history.push('/');
            } else {
                window.alert(error);
            }
        }
        return abortController.abort();
    // eslint-disable-next-line
    }, [data])

    // Função de Submit: verifica dados e direciona o usuário
    function onSubmit(event) {
        event.preventDefault();
        // Recebe token ou erro da função de validação do usuário
        fetchUserAPI();
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

                            <section id="loginForm" className={smScreen ? classes.smLoginForm : 'none'}>
                                <MyTextField
                                    id="emailField"
                                    label="E-mail"
                                    variant="outlined"
                                    name="email"
                                    type="email"
                                    // className={classes.textField}
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
                                    onClick={onSubmit}>Entrar</AddButton>
                            </section>
                    </LoginCard>
                    </Grid>
                </Grid>
            </MyContainer>
        </main>
    );
}

export default withRouter(Login);