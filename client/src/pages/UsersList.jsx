import React, {Component} from 'react'
import api from '../api'

// Tabela Local: Material UI
import Table from "../components/Table"
import {CreateUser, MyContainer} from "../styles/styledComponents"

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
            <MyContainer>
                <h1 className="heading-page">Controle de Usuário</h1>
                <Table data={usuarios}/>
                <CreateUser/>
            </MyContainer>
        )
    }
}

export default UsersList;