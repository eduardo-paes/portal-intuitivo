import React, {useState, useEffect} from 'react'
import api from '../../api'

// Tabela Local: Material UI
import {UserTable} from "../../components"
import {CreateButton, MyContainer} from "../../assets/styles/styledComponents"

function UsersList() {
    const [user, setUser] = useState({
        usuarios: []
    })

    useEffect(() => {
        let unmounted = false;
        async function fetchAPI () {
            let response = await api.listarUsuarios();

            if (!unmounted) {
                setUser({ usuarios: response.data.data })
            }
        }
        fetchAPI();
        return () => {unmounted = true};
    }, [user]);

    const {usuarios} = user;

    // Retorna a Tabela
    return (
        <MyContainer>
            <h1 className="heading-page">Controle de Usuário</h1>
            <UserTable data={usuarios}/>
            <CreateButton title="Registrar" url="/controle-usuario/create"/>
        </MyContainer>
    )
}

export default UsersList;