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
    {marginBottom: "1%", backgroundColor: "#fff", display: "flex", color: "primary"}
);

// -- Hook Principal
class UsersUpdate extends Component {
    // Definição do construtor
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.match.params.id,
            nome: "",
            email: "",
            acesso: "",
            erros: []
        }
    }

    // Guarda o dado vindo do input
    handleChangeInput = async event => {
        const {name, value} = event.target;
        this.setState({
            ...this.state,
            [name]: value
        });
    }

    // Salva as mudanças no banco
    handleUpdateUser = async () => {
        const {id, nome, email, acesso, senha} = this.state
        const error = validate(this.state)

        this.setState({
            ...this.state,
            erros: error
        });

        if (error.validated) {
            const usuarioAtualizado = {
                nome,
                email,
                acesso,
                senha
            }

            await api
                .atualizarUsuario(id, usuarioAtualizado)
                .then(res => {
                    window.alert("Usuário atualizado com sucesso.")
                })
        }
    }

    componentDidMount = async () => {
        const {id} = this.state;
        const usuario = await api.encUsuarioPorID(id);

        this.setState(
            {nome: usuario.data.data.nome, email: usuario.data.data.email, acesso: usuario.data.data.acesso, senha: usuario.data.data.senha}
        );
    }

    // Formulário - Atualização
    render() {
        const {nome, email, acesso, senha, erros} = this.state

        return (
            <div className="container-fluid">
                <div className="form-group">
                    <h1 className="heading-page">Atualizar Usuário</h1>

                    <MyTextField
                        id="outlined-basic"
                        label="Nome"
                        variant="outlined"
                        name="nome"
                        type="text"
                        value={nome}
                        autoFocus={true}
                        onChange={this.handleChangeInput}
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
                        onChange={this.handleChangeInput}
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
                        onChange={this.handleChangeInput}
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
                        id="outlined-uncontrolled"
                        label="Senha"
                        variant="outlined"
                        name="senha"
                        type="password"
                        value={senha}
                        onChange={this.handleChangeInput}
                        error={erros.senha
                            ? true
                            : false}
                        InputLabelProps={{
                            shrink: true
                        }}/> {erros.senha && <p className="error-message">{erros.senha}</p>}

                    <div className="group-buttons">
                        <AddButton variant="contained" color="primary" onClick={this.handleUpdateUser}>Atualizar</AddButton>
                        <Link to="/controle-usuario/list">
                            <DeleteButton variant="contained" color="secondary">Cancelar</DeleteButton>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default UsersUpdate