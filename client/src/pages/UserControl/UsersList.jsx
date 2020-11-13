import React, {useState, useEffect} from 'react'
import api from '../../api'

// Tabela Local: Material UI
import { UserTable } from "../../components"
import { CreateButton, MyContainer, GeneralTitle } from "../../assets/styles/styledComponents"

const initialFilter = {
    nome: '',
    email: '',
    acesso: '',
}

export default function UsersList() {
    const [usuario, setUsuario] = useState([])
    const [mount, setMount] = useState({
        isMounted: true,
        wasChanged: false
    })
    const [filterDialog, setFilterDialog] = useState(false);
    const [filter, setFilter] = useState(initialFilter);
    const [tempData, setTempData] = useState([]);

    async function fetchAPI () {
        let response = await api.listarUsuarios();
        setUsuario(response.data.data);
        setTempData(response.data.data)
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

    useEffect(() => {
        const abortController = new AbortController();
        if (filter !== initialFilter) {
            setTempData(usuario.filter(row => {
                let auxName = (row.nome.toLowerCase().includes(filter.nome.toLowerCase()) || filter.nome === '') ? true : false;
                let auxEmail = (row.email.toLowerCase().includes(filter.email.toLowerCase()) || filter.email === '') ? true : false;
                let auxAccess = (row.acesso === filter.acesso || filter.acesso === '') ? true : false;
    
                return (auxName && auxEmail && auxAccess) && row;
            }))
        } else {
            setTempData(usuario);
        }
        return abortController.abort();
        // eslint-disable-next-line
    }, [filter])

    // Retorna a Tabela
    return (
        <MyContainer>
            <GeneralTitle>Controle de Usuário</GeneralTitle>

            <UserTable 
                data={tempData} 
                setMount={setMount}
                filterDialog={filterDialog}
                setFilterDialog={setFilterDialog}
                filter={filter}
                setFilter={setFilter}/>

            <div className="create-button">
                <CreateButton title="Registrar" url="/controle-usuario/create"/>
            </div>
        </MyContainer>
    )
}