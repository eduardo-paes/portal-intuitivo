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

    useEffect(() => {
        async function fetchMyAPI() {
            const response = await api.listarUsuarios();
            const value = await response.data.data;
            setData(value);
        }
        fetchMyAPI()
    }, []);

    function handleChange(event) {
        const {name, value} = event.target;
        setUsuario(preValue => ({
            ...preValue,
            [name]: value
        }));
    }

    function onSubmit(event) {
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

        </MyContainer>
    );
}

export default withRouter(Login);