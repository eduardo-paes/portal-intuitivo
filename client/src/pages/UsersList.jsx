import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import api from '../api'

// Ícones: Material-UI
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';

import Table from 'react-bootstrap/Table'

// Botão de Atualização
class UpdateUser extends Component {
    // Definição do evento
    updateUser = event => {
        event.preventDefault();
        window.location.href = `/controle-usuario/update/${this.props.id}`
    }

    // Retorna o botaão
    render() {
        return (
            <IconButton
                aria-label="update"
                color="primary"
                size="small"
                onClick={this.updateUser}>
                <EditIcon/>
            </IconButton>
        )
    }
}

// Botão de Remoção
class DeleteUser extends Component {
    // Definição do evento
    deleteUser = event => {
        event.preventDefault();
        // Mensagem de confirmação
        if (window.confirm(`Quer remover o usuário ${this.props.nome} permanentemente?`)) {
            api.removerUsuario(this.props.id)
            window
                .location
                .reload()
        }
    }

    // Retorna o botaão
    render() {
        return (
            <IconButton
                aria-label="delete"
                color="secondary"
                size="small"
                onClick={this.deleteUser}>
                <DeleteIcon/>
            </IconButton>
        )
    }
}

// Botão de Registrar
class CreateUser extends Component {
    render() {
        return (
            <div className="createButton">
                <Link to="/controle-usuario/create">
                    <button className="btn btn-outline-primary">
                        <AddIcon/>
                        Registrar
                    </button>
                </Link>
            </div>
        )
    }
}

class UsersList extends Component {
    // Definição do construtor
    constructor(props) {
        super(props)
        this.state = {
            usuarios: []
        }
    }

    // Montagem dos componentes
    componentDidMount = async () => {

        await api
            .listarUsuarios()
            .then(usuarios => {
                this.setState({usuarios: usuarios.data.data})
            })
    }

    // Renderização da tabela
    render() {
        const {usuarios} = this.state

        // Retorna a Tabela
        return (
            <div className="form-group container-fluid">
                <h1>Controle de Usuário</h1>

                <Table
                    table-bordered
                    responsive="responsive"
                    striped="striped"
                    bordered="bordered"
                    hover="hover"
                    size="sm">
                    <thead>
                        <tr>
                            <th>Nome Completo</th>
                            <th>E-mail</th>
                            <th>Tipo de Acesso</th>
                            <th>Funções</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            usuarios.map(usuario => (
                                <tr>
                                    <td>{usuario.nome}</td>
                                    <td>{usuario.email}</td>
                                    <td>{usuario.acesso}</td>
                                    <td className="group-buttons">
                                        <DeleteUser id={usuario._id} nome={usuario.nome}/>
                                        <UpdateUser id={usuario._id}/>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
                <CreateUser/>
            </div>
        )
    }
}

export default UsersList;