import React, {Component} from 'react'
import api from '../../api'

// Formulário
import UserForm from "../../components/Form/UserForm"
// Função de validação dos campos do formulário
import validate from "../../components/Form/Validation/FormValidateUser"

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
            url: "",
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
            urlArquivo: URL.createObjectURL(file),
            foto: file
        })
    }

    // Salva os dados do formulário no banco
    handleIncludeUser = async (event) => {
        // Recebe os campos coletados
        const {nome, email, acesso, senha, foto} = this.state;
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
                senha
            };
            
            // Guarda novo usuário no banco
            await api
            .inserirUsuario(novoUsuario)
            .then(res => {
                window.alert("Usuário inserido com sucesso.");

                if (foto) {
                    const formData = new FormData();
                    formData.append("foto", foto);
                    fetch(`http://localhost:5000/api/upload-profile/${res.data.id}`, {
                            method: 'POST',
                            body: formData
                        })
                        .then(res => res.json())
                }
                
                // Limpa os campos
                    this.setState({nome: "", email: "", acesso: "", senha: "", urlArquivo: ""})
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