import React, {useState, useEffect, useContext} from 'react'
import {Link} from 'react-router-dom';
import {useHistory, withRouter} from 'react-router-dom';
import {StoreContext} from "../../utils"
import api from '../../api'

// -- Styles / Componentes gráficos
import {makeStyles} from '@material-ui/core';
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
        width: "100%",
        height: "100%"
    },
    loginButton: {
        margin: "3%",
    },
    forgotButton: {
        color: red[500],
        padding: "5% 0 3%",
        marginTop: "5%"
    },
    container: {
        margin: "auto"
    },
    textField: {
        marginTop: "1rem",
    },
    groupTextFields: {
        // alignItems: "flex-end"
    },
    groupButtons: {
        // alignItems: "flex-end"
    },
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

    const {setToken} = useContext(StoreContext)
    const history = useHistory();

    // Acesso a API - Retorna usuário do banco de dados
    useEffect(() => {
        async function fetchMyAPI() {
            const response = await api.listarUsuarios();
            const value = await response.data.data;
            setData(value);
        }
        fetchMyAPI()
    }, []);

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

        // Recebe token ou erro da função de validação do usuário
        const {token, error} = validateLogin(usuario, data);

        // Se há token, leva o usuário para a página permitida
        if (token) {
            setToken(token);
            // console.log("Login:", token);
            return history.push('/');
        } else {
            window.alert(error);
        }

        // Limpa dados dos inputs
        setUsuario(initialState);
    }

    return (
        <div id="login-screen" className="container">
            <MyContainer className={classes.container} maxWidth="sm">
                <LoginCard>
                    <header className={classes.header}>
                        <img className={classes.logo} src={logo} alt="Logo"/>
                        <MyTypography align="center" variant="h4">Login</MyTypography>
                    </header>

                    <body className={classes.groupTextFields}>
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
                    </body>

                    <footer className={classes.groupButtons}>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <p className={classes.forgotButton}>Esqueceu a senha?</p>
                        </Link>
                        <AddButton
                            className={classes.loginButton}
                            size="large"
                            variant="contained"
                            color="primary"
                            onClick={onSubmit}>Entrar</AddButton>
                    </footer>
                </LoginCard>
            </MyContainer>
        </div>
    );
}

export default withRouter(Login);