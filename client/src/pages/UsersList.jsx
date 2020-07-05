import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import api from '../api'

// Ícones: Material-UI
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';

import Table from 'react-bootstrap/Table'
import { Button } from '@material-ui/core';

// Botão de Atualização
class UpdateUser extends Component {
    // Retorna o botaão
    render() {
        return (
            <Link to={"/controle-usuario/update/" + this.props.id}>
                <IconButton aria-label="update" color="primary" size="small">
                    <EditIcon/>
                </IconButton>
            </Link>
        )
    }
}

// Botão de Remoção
function DeleteUser (props) {
    function removing() {
        if (window.confirm(`Quer remover o usuário ${props.nome} permanentemente?`)) {
            api.removerUsuario(props.id)
            window.location.reload()
        }
    }

    return (
        <Link to={"/controle-usuario/list"}>
            <IconButton
                aria-label="delete"
                color="secondary"
                size="small"
                onClick={removing}>
                <DeleteIcon/>
            </IconButton>
        </Link>
    )
}

// Botão de Registrar
class CreateUser extends Component {
    render() {
        return (
            <div className="create-button">
                <Link to="/controle-usuario/create">
                    <Button variant="outlined" color="primary">
                        <AddIcon/>
                        Registrar
                    </Button>
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
                <h1 className="heading-page">Controle de Usuário</h1>

                <Table
                    table-bordered="table-bordered"
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
                                <tr key={usuario._id}>
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