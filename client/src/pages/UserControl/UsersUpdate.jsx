import Axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import api from '../../api'

// Formulário
import UserForm from "../../components/Form/UserForm"
// Função de validação dos campos do formulário
import validate from "../../components/Form/Validation/FormValidateUser"

// -- Hook Principal
export default function UsersUpdate (props) {
    const initialState = {
        id: props.match.params.id,
        nome: "",
        email: "",
        acesso: "",
        disciplina: [],
        erros: [],
        url: "",
        foto: {}
    }
    const history = useHistory();
    const [usuario, setUsuario] = useState(initialState);
    const [profDisciplinas, setProfDisciplinas] = useState([{
        disciplinaID: ''
    }]);
    const [senhaAntiga, setSenhaAntiga] = useState('');

    useEffect(() => {
        const abortController = new AbortController();
        async function fetchUsuarioAPI () {
            const response = await api.encUsuarioPorID(props.match.params.id);
            const value = response.data;

            if (value.success) {
                setSenhaAntiga(value.data.senha);
                setUsuario(preValue => ({
                    ...preValue,
                    nome: value.data.nome, 
                    email: value.data.email, 
                    acesso: value.data.acesso, 
                    senha: '', 
                    url: value.data.url
                }));
            }
    
            if (value.data.disciplina) {
                setProfDisciplinas(value.data.disciplina);
            }
        }
        fetchUsuarioAPI();
        return abortController.abort();
    }, [props.match.params.id])

    // Salva as mudanças no banco
    async function handleUpdateUser () {
        // Cria usuário atualizado
        var usuarioAtualizado = {
            nome: usuario.nome,
            email: usuario.email,
            acesso: usuario.acesso,
            senha: usuario.senha === '' ? senhaAntiga : usuario.senha,
            disciplina: usuario.disciplina,
            url: ''
        }
        
        // Recebe os campos coletados
        const error = validate(usuarioAtualizado, true)
        setUsuario(preValue => ({
            ...preValue,
            erros: error
        }));
        
        if (error.validated) {
            const {id, foto} = usuario;
            
            const data = new FormData();
            data.append("foto", foto);
            
            await Axios
            .post(`http://localhost:5000/api/upload-profile/${id}`, data)
            .then(res => usuarioAtualizado.url = res.data.url);

            // Guarda usuário atualizado no banco
            await api
                .atualizarUsuario(id, usuarioAtualizado)
                .then(res => {
                    window.alert("Usuário atualizado com sucesso.")
                    history.push('/controle-usuario/list');
                    window.location.reload();
                })
        }
    }

    // Formulário - Atualização
    return (
        <UserForm
            data={usuario}
            onSubmit={handleUpdateUser}
            setUsuario={setUsuario}
            typeForm="Atualizar"
            edit={true}
            profDisciplinas={profDisciplinas}
            setProfDisciplinas={setProfDisciplinas}
        /> 
    );
}
