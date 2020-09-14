import React, { useState } from 'react'
import api from '../../api'

// Formulário
import UserForm from "../../components/Form/UserForm"
// Função de validação dos campos do formulário
import validate from "../../components/Form/Validation/FormValidateUser"
import { useEffect } from 'react';

// -- Hook Principal
export default function UsersUpdate (props) {
    const initialState = {
        id: props.match.params.id,
        nome: "",
        email: "",
        acesso: "",
        erros: [],
        url: "",
        foto: {}
    }
    const [usuario, setUsuario] = useState(initialState);

    useEffect(() => {
        const abortController = new AbortController();
        async function fetchUsuarioAPI () {
            const response = await api.encUsuarioPorID(props.match.params.id);
            const value = response.data.data;
    
            setUsuario(preValue => ({
                ...preValue,
                nome: value.nome, 
                email: value.email, 
                acesso: value.acesso, 
                senha: value.senha, 
                url: `http://localhost:5000/uploads/profile/${props.match.params.id}.jpeg`
            }));
        }
        fetchUsuarioAPI();
        return abortController.abort();
    }, [props.match.params.id])

    // Salva as mudanças no banco
    async function handleUpdateUser () {
        // Recebe os campos coletados
        const error = validate(usuario)
        setUsuario(preValue => ({
            ...preValue,
            erros: error
        }));

        if (error.validated) {
            const {id, nome, email, acesso, senha, foto} = usuario;

            // Cria usuário atualizado
            const usuarioAtualizado = {
                nome,
                email,
                acesso,
                senha
            }

            // Guarda usuário atualizado no banco
            await api
                .atualizarUsuario(id, usuarioAtualizado)
                .then(res => {
                    window.alert("Usuário atualizado com sucesso.")
                    const data = new FormData();
                    data.append("foto", foto);
                    fetch(`http://localhost:5000/api/upload-profile/${res.data.id}`, {
                        method: 'POST',
                        body: data
                    })
                    .then(res => {
                        window.location.reload();
                        res.json();
                    })    
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
        /> 
    );
}