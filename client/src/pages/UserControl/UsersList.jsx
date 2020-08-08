import React, {useState, useEffect} from 'react'
import api from '../../api'

// Tabela Local: Material UI
import {UserTable} from "../../components"
import {CreateUser, MyContainer} from "../../assets/styles/styledComponents"

function UsersList(props) {
    const [user, setUser] = useState({
        usuarios: []
    })

    useEffect(() => {
        const abortController = new AbortController();
        async function fetchMyAPI() {
            const response = await api.listarUsuarios();
            const value = await response.data.data;
            setUser({usuarios: value})
        }
        fetchMyAPI()
        return abortController.abort();
    }, [user]);

    const {usuarios} = user;

    // Retorna a Tabela
    return (
        <MyContainer>
            <h1 className="heading-page">Controle de Usuário</h1>
            <UserTable data={usuarios}/>
            <CreateUser/>
        </MyContainer>
    )
}

export default UsersList;