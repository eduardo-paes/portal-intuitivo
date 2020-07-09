import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import api from '../api'

// -- Material UI
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import {red, cyan} from '@material-ui/core/colors';

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

class UsersUpdate extends Component {
    // Definição do construtor
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.match.params.id,
            nome: "",
            email: "",
            acesso: ""
        }
    }

    // Guarda o nome vindo do input
    handleChangeInputName = async event => {
        const nome = event
            .target
            .value
            this
            .setState({nome})
    }

    // Guarda o email vindo do input
    handleChangeInputEmail = async event => {
        const email = event
            .target
            .value
            this
            .setState({email})
    }

    // Guarda o tipo de acesso vindo do input
    handleChangeInputAccess = async event => {
        const acesso = event
            .target
            .value
            this
            .setState({acesso})
    }

    // Função que salva as mudanças no banco
    handleUpdateUser = async () => {
        const {id, nome, email, acesso} = this.state
        const usuarioAtualizado = {
            nome,
            email,
            acesso            
        }

        await api
            .atualizarUsuario(id, usuarioAtualizado)
            .then(res => {
                window.alert("Usuário atualizado com sucesso.")
            })
    }

    componentDidMount = async () => {
        const {id} = this.state;
        const usuario = await api.encUsuarioPorID(id);

        this.setState(
            {nome: usuario.data.data.nome, email: usuario.data.data.email, acesso: usuario.data.data.acesso}
        );
    }

    // Formulário - Atualização
    render() {
        const {nome, email, acesso} = this.state
        return (
            <div className="container-fluid">
                <div className="form-group">
                    <h1 className="heading-page">Atualizar Usuário</h1>

                    <label>Nome:
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        value={nome}
                        onChange={this.handleChangeInputName}/>

                    <label>E-mail:
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        value={email}
                        onChange={this.handleChangeInputEmail}/>

                    <label>Acesso:</label>
                    <select
                        className="form-control"
                        type="text"
                        value={acesso}
                        onChange={this.handleChangeInputAccess}>
                        <option value="Aluno">Aluno</option>
                        <option value="Professor">Professor</option>
                        <option value="Administrador">Administrador</option>
                    </select>
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