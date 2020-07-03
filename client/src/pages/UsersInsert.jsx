import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import api from '../api'

class UsersInsert extends Component {
    // Definição do construtor
    constructor(props) {
        super(props)

        this.state = {
            nome: "",
            email: "",
            acesso: ""
        }
    }

    // Guarda o nome vindo do input
    handleChangeInputName = async event => {
        const nome = event.target.value;
        this.setState({nome});
    }

    // Guarda o email vindo do input
    handleChangeInputEmail = async event => {
        const email = event.target.value;
        this.setState({email});
    }

    // Guarda o tipo de acesso vindo do input
    handleChangeInputAccess = async event => {
        const acesso = event.target.value;
        this.setState({acesso});
    }

    // Salva os dados do formulário no banco
    handleIncludeUser = async () => {
        const {nome, email, acesso} = this.state; // Recebe os 3 campos coletados
        const novoUsuario = {
            nome,
            email,
            acesso
        }; // Cria novo usuário

        await api
            .inserirUsuario(novoUsuario)
            .then(res => {
                window.alert("Usuário inserido com sucesso.")
                // Limpa os campos
                this.setState({nome: "", email: "", acesso: ""})
            })
    }

    // Formulário - Criação
    render() {
        const {nome, email, acesso} = this.state
        return (
            <div className="form-group">
                <h1 className="heading-page">Criar Usuário</h1>
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
                    <option value=""/>
                    <option value="Aluno">Aluno</option>
                    <option value="Professor">Professor</option>
                    <option value="Administrador">Administrador</option>
                </select>
                <div className="group-buttons">
                    <button className="btn btn-primary bottom-btn" onClick={this.handleIncludeUser}>Adicionar</button>
                    <Link to="/controle-usuario/list">
                        <button className="btn btn-danger bottom-btn">Cancelar</button>
                    </Link>
                </div>
            </div>
        )
    }
}

export default UsersInsert