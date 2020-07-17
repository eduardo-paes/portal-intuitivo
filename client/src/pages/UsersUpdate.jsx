import React, {Component} from 'react'
import api from '../api'

// Formulário
import UserForm from "../components/Form/UserForm"
// Função de validação dos campos do formulário
import validate from "../components/Form/FormValidateUser"

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
    handleChange = async event => {
        const {name, value} = event.target;
        this.setState({
            ...this.state,
            [name]: value
        });
    }

    // Salva as mudanças no banco
    handleUpdateUser = async () => {
        // Recebe os campos coletados
        const {id, nome, email, acesso, senha} = this.state
        const error = validate(this.state)

        this.setState({
            ...this.state,
            erros: error
        });

        if (error.validated) {
            // Cria usuário atualizado
            const usuarioAtualizado = {
                nome,
                email,
                acesso,
                senha
            }

            // Guarda usuário atualizado no banco
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
            {
                nome: usuario.data.data.nome, 
                email: usuario.data.data.email, 
                acesso: usuario.data.data.acesso, 
                senha: usuario.data.data.senha
            }
        );
    }

    // Formulário - Atualização
    render() {
        return (
            <UserForm
                data={this.state}
                handleChange={this.handleChange}
                onSubmit={this.handleUpdateUser}
                typeForm="Atualizar"
                edit={true}
            /> 
        )
    }
}

export default UsersUpdate