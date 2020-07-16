import React, {useState, useEffect, useContext} from 'react'
import {useHistory, withRouter} from 'react-router-dom';
import StoreContext from "../components/Store/Context"
import api from '../api'

// -- Styles / Componentes gráficos
import {makeStyles} from "@material-ui/core/styles";
import logo from "../images/logos intuitivo-01.png"
import {
    AddButton,
    MyTextField,
    MyContainer,
    MyTypography,
    MyCardContent,
    MyCard
} from "../styles/styledComponents"

// -- Style Classes
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

// -- Dados iniciais
function initialState() {
    return {email: "", senha: ""}
}

// -- Função de validação do usuário
function validateLogin (usuario, data) {
    // Verifica se há algum usuário com o e-mail informado
    let foundUser = data.filter(user => user.email.includes(usuario.email));

    // Verifica se algum usuário foi encontrado
    if (foundUser.length > 0) {
        // Verifica se a senha está correta
        if (foundUser[0].senha === usuario.senha) {
            return { token: {
                userID: foundUser[0]._id,
                accessType: foundUser[0].acesso
            } }
        }
    }
    // Retorna erro caso haja
    return { error: 'Usuário ou senha inválido' }
}

function Login() {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [usuario, setUsuario] = useState(initialState)

    const { setToken } = useContext(StoreContext)
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

        console.log(token);

        // Limpa dados dos inputs
        setUsuario(initialState);
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

                    <p className={classes.message}>Esqueceu a senha?</p>

                    <AddButton
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        onClick={onSubmit}>Entrar</AddButton>

                </MyCardContent>
            </MyCard>
        </MyContainer>
    );
}

export default withRouter(Login);