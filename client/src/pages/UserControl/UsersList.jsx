import React, {useState, useEffect} from 'react'
import api from '../../api'

// Tabela Local: Material UI
import {UserTable} from "../../components"
import {CreateButton, MyContainer} from "../../assets/styles/styledComponents"

function UsersList() {
    const [usuario, setUsuario] = useState([])
    const [mount, setMount] = useState({
        isMounted: true,
        wasChanged: false
    })

    async function fetchAPI () {
        let response = await api.listarUsuarios();
        setUsuario(response.data.data);
    }

    useEffect(() => {
        const abortController = new AbortController();
        if (mount.isMounted) {
            fetchAPI();
            setMount(preValue => ({...preValue, isMounted: false}))
        }
        return abortController.abort();
    // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const abortController = new AbortController();
        if (mount.wasChanged) {
            fetchAPI();
            setMount(preValue => ({...preValue, wasChanged: false}))
        }
        return abortController.abort();
    }, [mount]);

    // Retorna a Tabela
    return (
        <MyContainer>
            <h1 className="heading-page">Controle de Usuário</h1>
            <UserTable usuarios={usuario} setMount={setMount}/>
            <CreateButton title="Registrar" url="/controle-usuario/create"/>
        </MyContainer>
    )
}

export default UsersList;