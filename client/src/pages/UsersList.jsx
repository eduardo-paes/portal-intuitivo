import React, {Component} from 'react'
import {Link as RouterLink} from 'react-router-dom';
import api from '../api'

// Ícones: Material-UI
import AddIcon from '@material-ui/icons/Add';
import {Button} from '@material-ui/core';

// Tabela Local: Material UI
import Table from "../components/Table"

// Botão de Registrar
class CreateUser extends Component {
    render() {
        return (
            <div className="create-button">
                <RouterLink to="/controle-usuario/create">
                    <Button variant="outlined" color="primary" startIcon={<AddIcon/>}>
                        Registrar
                    </Button>
                </RouterLink>
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
            <div className="container-fluid">
                <div className="form-group">
                    <h1 className="heading-page">Controle de Usuário</h1>
                    <Table data={usuarios}/>
                    <CreateUser/>
                </div>
            </div>
        )
    }
}

export default UsersList;