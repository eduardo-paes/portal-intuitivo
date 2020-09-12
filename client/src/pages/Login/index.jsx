import React, { useState, useContext } from 'react'
import { Link, useHistory, withRouter } from 'react-router-dom';
import { StoreContext } from "../../utils"
import api from '../../api'

// -- Styles / Componentes gráficos
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles, useTheme, Grid } from '@material-ui/core';
import {red} from '@material-ui/core/colors';
import logo from "../../assets/images/LoginLogo.png"
import {
    AddButton,
    MyTextField,
    MyContainer,
    MyTypography,
    LoginCard
} from "../../assets/styles/styledComponents"
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

// -- Função de validação do usuário
function validateLogin(usuario, data) {
    // Verifica se há algum usuário com o e-mail informado
    let foundUser = data.filter(user => user.email.includes(usuario.email));

    // Verifica se algum usuário foi encontrado
    if (foundUser.length > 0) {
        // Verifica se a senha está correta
        if (foundUser[0].senha === usuario.senha) {
            return {
                token: {
                    userID: foundUser[0]._id,
                    userName: foundUser[0].nome,
                    accessType: foundUser[0].acesso,
                    nameImage: foundUser[0].nomeArquivo
                }
            }
        }
    }
    // Retorna erro caso haja
    return {error: 'Usuário ou senha inválido'}
}

function Login() {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [usuario, setUsuario] = useState(initialState)

    const theme = useTheme();
    const smScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const {setToken} = useContext(StoreContext)
    const history = useHistory();

    // Acesso a API - Retorna usuário do banco de dados
    async function fetchUsuariosAPI() {
        const response = await api.listarUsuarios();
        const value = await response.data.data;
        setData(value);
    }

    // Função para pegar os valores do formulário
    function handleChange(event) {
        const {name, value} = event.target;
        setUsuario(preValue => ({
            ...preValue,
            [name]: value
        }));
    }

    // Função de Submit: verifica dados e direciona o usuário
    function onSubmit(event) {
        event.preventDefault();

        // Puxa usuários do banco e aloca em data
        fetchUsuariosAPI();

        // Recebe token ou erro da função de validação do usuário
        const {token, error} = validateLogin(usuario, data);

        // Se há token, leva o usuário para a página permitida
        if (token) {
            setToken(token);
            return history.push('/');
        } else {
            window.alert(error);
        }
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