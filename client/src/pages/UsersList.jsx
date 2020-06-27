import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import api from '../api'

// Botão de Atualização
class UpdateUser extends Component {
    // Definição do evento
    updateUser = event => {
        event.preventDefault();
        window.location.href = `/controle-usuario/update/${this.props.id}`
    }
    
    // Retorna o botaão
    render() {
        return <button onClick={this.updateUser}>Update</button>
    }
}

// Botão de Remoção
class DeleteUser extends Component {
    // Definição do evento
    deleteUser = event => {
        event.preventDefault();
        // Mensagem de confirmação
        if (window.confirm(`Quer remover o usuário ${this.props.id} permanentemente?`,)) {
            api.removerUsuario(this.props.id)
            window
                .location
                .reload()
        }
    }

    // Retorna o botaão
    render() {
        return <button onClick={this.deleteUser}>Delete</button>
    }
}

class UsersList extends Component {
    // Definição do construtor
    constructor(props) {
        super(props)
        this.state = {
            usuarios: [],
            columns: [],
            isLoading: false
        }
    }

    // Montagem dos componentes
    componentDidMount = async () => {
        this.setState({isLoading: true})

        await api
            .listarUsuarios()
            .then(usuarios => {
                this.setState ({
                    usuarios: usuarios.data.data, 
                    isLoading: false
                })
            })
    }

    // Renderização da tabela
    render() {
        const {usuarios} = this.state

        // Retorna a Tabela
        return (
            <div className="container">
                <h1>Controle de Usuário</h1>
                <table>
                    <tr>
                        <th>Nome Completo</th>
                        <th>E-mail</th>
                        <th>Tipo de Acesso</th>
                        <th>Funções</th>
                    </tr>
                    {usuarios.map(usuario => (
                        <tr>
                            <td>{usuario.nome}</td>
                            <td>{usuario.email}</td>
                            <td>{usuario.acesso}</td>
                            <td>
                                <span><DeleteUser id={usuario._id}/></span>
                                <span><UpdateUser id={usuario._id}/></span>
                            </td>
                        </tr>
                    ))}
                </table>
                <Link to="/controle-usuario/create">
                    <button>
                        <span>Registrar</span>
                    </button>
                </Link>
            </div>
        )
    }
}

export default UsersList;