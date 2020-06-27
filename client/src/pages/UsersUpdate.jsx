import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import api from '../api'

class UsersUpdate extends Component {
    // Definição do construtor
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.match.params.id,
            nome: '',
            email: '',
            acesso: '',
        }
    }

    // Guarda o nome vindo do input
    handleChangeInputName = async event => {
        const nome = event.target.value
        this.setState({ nome })
    }

    // Guarda o email vindo do input
    handleChangeInputEmail = async event => {
        const email = event.target.value
        this.setState({ email })
    }

    // Guarda o tipo de acesso vindo do input
    handleChangeInputAccess = async event => {
        const acesso = event.target.value
        this.setState({ acesso })
    }

    // Função que salva as mudanças no banco
    handleUpdateUser = async () => {
        const { id, nome, email, acesso } = this.state
        const usuarioAtualizado = { nome, email, acesso }

        await api.atualizarUsuario(id, usuarioAtualizado).then(res => {
            window.alert("Usuário atualizado com sucesso.")
            // this.setState({
            //     nome: '',
            //     email: '',
            //     acesso: '',
            // })
        })
    }

    componentDidMount = async () => {
        const { id } = this.state;
        const usuario = await api.encUsuarioPorID(id);

        this.setState({
            nome: usuario.data.data.nome,
            email: usuario.data.data.email,
            acesso: usuario.data.data.acesso
        });
    }

    // Formulário - Atualização
    render() {
        const { nome, email, acesso } = this.state
        return (
            <div className="form-group">
                <h1>Atualizar Usuário</h1>

                <label>Nome: </label>
                <input
                    className="form-control"
                    type="text"
                    value={nome}
                    onChange={this.handleChangeInputName}
                />

                <label>E-mail: </label>
                <input
                    className="form-control"
                    type="text"
                    value={email}
                    onChange={this.handleChangeInputEmail}
                />

                <label>Acesso: </label>
                <input
                    className="form-control"
                    type="text"
                    value={acesso}
                    onChange={this.handleChangeInputAccess}
                />
                    <button onClick={this.handleUpdateUser}>Atualizar</button>
                <Link to="/controle-usuario/list">
                    <button>Cancelar</button>
                </Link>
            </div>
        )
    }
}

export default UsersUpdate