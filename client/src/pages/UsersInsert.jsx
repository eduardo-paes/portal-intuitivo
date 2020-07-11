import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import api from '../api'

// -- Material UI
import Button from '@material-ui/core/Button';
import {withStyles, styled} from '@material-ui/core/styles';
import {red, cyan} from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

// Função de validação dos campos do formulário
import validate from "../components/FormValidateUser"

// -- Button Styles
const AddButton = withStyles((theme) => ({
    root: {
        color: theme
            .palette
            .getContrastText(cyan[700]),
        backgroundColor: cyan[500],
        '&:hover': {
            backgroundColor: cyan[700]
        },
        margin: theme.spacing(1)
    }
}))(Button);

const DeleteButton = withStyles((theme) => ({
    root: {
        color: theme
            .palette
            .getContrastText(red[700]),
        backgroundColor: red[500],
        '&:hover': {
            backgroundColor: red[700]
        },
        margin: theme.spacing(1)
    }
}))(Button);

const MyTextField = styled(TextField)(
    {marginBottom: "10px", backgroundColor: "#fff", display: "flex", color: "primary"}
);

// -- Hook Principal
class UsersInsert extends Component {
    // Definição do construtor
    constructor(props) {
        super(props)

        this.state = {
            nome: "",
            email: "",
            acesso: "",
            senha: "",
            erros: []
        }
    }

    // Recebe os dados do input e os guarda
    handleChange = async event => {
        const {name, value} = event.target;
        this.setState({
            ...this.state,
            [name]: value
        });
    }

    // Salva os dados do formulário no banco
    handleIncludeUser = async () => {
        // Recebe os campos coletados
        const {nome, email, acesso, senha} = this.state;
        const error = validate(this.state)

        this.setState({
            ...this.state,
            erros: error
        });

        if (error.validated) {
            // Cria novo usuário
            const novoUsuario = {
                nome,
                email,
                acesso,
                senha
            };

            // Guarda novo usuário no banco
            await api
                .inserirUsuario(novoUsuario)
                .then(res => {
                    window.alert("Usuário inserido com sucesso.")
                    // Limpa os campos
                    this.setState({nome: "", email: "", acesso: "", senha: ""})
                })
        }
    }

    // Formulário - Criação
    render() {
        const {nome, email, acesso, senha, erros} = this.state

        return (
            <div className="container-fluid">
                <div className="form-group">
                    <h1 className="heading-page">Criar Usuário</h1>

                    <MyTextField
                        id="outlined-basic"
                        label="Nome"
                        variant="outlined"
                        name="nome"
                        type="text"
                        value={nome}
                        autoFocus={true}
                        onChange={this.handleChange}
                        error={erros.nome
                            ? true
                            : false}/> {erros.nome && <p className="error-message">{erros.nome}</p>}

                    <MyTextField
                        id="outlined-basic"
                        label="E-mail"
                        variant="outlined"
                        name="email"
                        type="email"
                        value={email}
                        onChange={this.handleChange}
                        error={erros.email
                            ? true
                            : false}/> {erros.email && <p className="error-message">{erros.email}</p>}

                    <MyTextField
                        id="outlined-select-currency"
                        select={true}
                        label="Acesso"
                        name="acesso"
                        type="text"
                        value={acesso}
                        onChange={this.handleChange}
                        variant="outlined"
                        error={erros.acesso
                            ? true
                            : false}>
                        <MenuItem value="Aluno">Aluno</MenuItem>
                        <MenuItem value="Professor">Professor</MenuItem>
                        <MenuItem value="Administrador">Administrador</MenuItem>
                    </MyTextField>
                    {erros.acesso && <p className="error-message">{erros.acesso}</p>}

                    <MyTextField
                        id="outlined-basic"
                        label="Senha"
                        variant="outlined"
                        name="senha"
                        type="password"
                        value={senha}
                        onChange={this.handleChange}
                        error={erros.senha
                            ? true
                            : false}/> {erros.senha && <p className="error-message">{erros.senha}</p>}

                    <div className="group-buttons">
                        <AddButton variant="contained" color="primary" onClick={this.handleIncludeUser}>Adicionar</AddButton>
                        <Link to="/controle-usuario/list">
                            <DeleteButton variant="contained" color="secondary">Cancelar</DeleteButton>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default UsersInsert;