<<<<<<< HEAD
import React, {useState, useEffect, useContext} from 'react'
import {useHistory, withRouter} from 'react-router-dom';
import {StoreContext} from "../components/"
import api from '../api'

// -- Styles / Componentes gráficos
import {Button} from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";
import {red} from '@material-ui/core/colors';
import logo from "../images/loginLogo.png"
import {
    AddButton,
    MyTextField,
    MyContainer,
    MyTypography,
    MyCardContent
} from "../styles/styledComponents"

// -- Style Classes
const useStyles = makeStyles(theme => ({
    logo: {
        width: "100%",
        height: "100%"
    },
    button: {
        margin: "3%"
    },
    message: {
        color: red[500],
        marginTop: "5%"
    },
    container: {
        margin: "auto"
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

    const {setToken} = useContext(StoreContext)
    const history = useHistory();

    // Acesso a API - Retorna usuário do banco de dados
=======
import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom'
import {makeStyles} from "@material-ui/core/styles";
import logo from "../images/logos intuitivo-01.png"
import api from '../api'
import {
    AddButton,
    MyTextField,
    MyContainer,
    MyTypography,
    MyCardContent,
    MyCard
} from "../styles/styledComponents"

const useStyles = makeStyles(theme => ({
    logo: {
        width: "80%",
        height: "80%"
    },
    button: {
        marginTop: "2%"
    },
    message: {
        color: "red"
    }
}));

function Login(props) {
    const {history} = props;
    const classes = useStyles();
    const [data, setData] = useState([]);

    const [usuario, setUsuario] = useState({
        email: "",
        senha: ""
    })

>>>>>>> Adicionando tela de login
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
<<<<<<< HEAD
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
        <section id="login-screen">
            <MyContainer className={classes.container} maxWidth="sm">
                <MyCardContent>
                    <img className={classes.logo} src={logo} alt="Logo"/>
=======
        let foundUser = data.filter(user => user.email.includes(usuario.email));

        if (foundUser && foundUser[0].senha === usuario.senha) {
            history.push("/")
        } else {
            window.alert("Dados incorretos.")
        }
    }

    return (
        <MyContainer maxWidth="sm">

            <MyCard>
                <MyCardContent>
                    <img className={classes.logo} src={logo} alt="Logo"/>

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

                    <Link>
                        <p className={classes.message}>Esqueceu a senha?</p>
                    </Link>

                    <Link></Link>

                    <AddButton className={classes.button} variant="contained" color="primary" onClick={onSubmit}>Entrar</AddButton>

                </MyCardContent>
            </MyCard>
>>>>>>> Adicionando tela de login

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

                    <Button 
                        className={classes.message} 
                        variant="text"
                        href="/">Esqueceu a senha?</Button>
                    <br/>
                    
                    <AddButton
                        className={classes.button}
                        size="large"
                        variant="contained"
                        color="primary"
                        onClick={onSubmit}>Entrar</AddButton>

                </MyCardContent>
            </MyContainer>
        </section>
    );
}

export default withRouter(Login);