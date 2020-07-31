import React, {Component} from 'react'
import api from '../api'

// Formulário
import UserForm from "../components/Form/UserForm"
// Função de validação dos campos do formulário
import validate from "../components/Form/FormValidateUser"

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
            erros: [],
            nomeArquivo: "",
            urlArquivo: "",
            foto: {}
        }
    }

    // Recebe os dados do input e os guarda
    handleChange = async event => {
        const {name, value} = event.target;
        this.setState({
            ...this.state,
            [name]: value,
        });
    }

    handleUpload = async event => {
        
        const file = event.target.files[0];
        this.setState({ 
            ...this.state,
            nomeArquivo: "profile."+file.name,
            urlArquivo: URL.createObjectURL(file),
            foto: file
        })
    }

    // Salva os dados do formulário no banco
    handleIncludeUser = async (event) => {
        // Recebe os campos coletados
        const {nome, email, acesso, senha, nomeArquivo, urlArquivo, foto} = this.state;
        const error = validate(this.state);

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
                senha,
                nomeArquivo,
                urlArquivo
            };

            if (foto) {
                const formData = new FormData();
                formData.append("foto", foto);
                fetch('http://localhost:3000/api/controle-usuario', {
                        method: 'POST',
                        body: formData
                    })
                    .then(res => res.json())
            }

            // Guarda novo usuário no banco
            await api
                .inserirUsuario(novoUsuario)
                .then(res => {
                    window.alert("Usuário inserido com sucesso.")
                    // Limpa os campos
                    this.setState({nome: "", email: "", acesso: "", senha: "", nomeArquivo: "", urlArquivo: ""})
                })
            
        }
    }

    // Formulário - Criação
    render() {
        return (
            <UserForm
                data={this.state}
                handleChange={this.handleChange}
                handleUpload={this.handleUpload}
                onSubmit={this.handleIncludeUser}
                typeForm="Registrar"
                edit={false}
            /> 
        )
    }
}

export default UsersInsert;