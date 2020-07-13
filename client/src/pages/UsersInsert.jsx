import React, {Component} from 'react'
import api from '../api'

// Formulário
import UserForm from "../components/UserForm"
// Função de validação dos campos do formulário
import validate from "../components/FormValidateUser"

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
        return (
            <UserForm
                data={this.state}
                handleChange={this.handleChange}
                onSubmit={this.handleIncludeUser}
                typeForm="Criar"
                edit={false}
            /> 
        )
    }
}

export default UsersInsert;