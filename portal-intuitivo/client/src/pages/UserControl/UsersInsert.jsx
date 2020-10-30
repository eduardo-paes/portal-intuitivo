import React, { useState} from 'react'
import api from '../../api'

// Formulário
import UserForm from "../../components/Form/UserForm"
// Função de validação dos campos do formulário
import validate from "../../components/Form/Validation/FormValidateUser"

// -- Hook Principal
export default function UsersInsert() {
    const initialState = {
        nome: "",
        email: "",
        acesso: "",
        disciplina: [],
        erros: [],
        url: "",
        foto: {}
    }
    const [usuario, setUsuario] = useState(initialState);
    const [profDisciplinas, setProfDisciplinas] = useState([{
        disciplinaID: ''
    }]);

    // Salva as mudanças no banco
    async function handleIncludeUser () {
        // Recebe os campos coletados
        const error = validate(usuario, false)
        setUsuario(preValue => ({
            ...preValue,
            erros: error
        }));

        if (error.validated) {
            const { nome, email, acesso, senha, disciplina, foto } = usuario;

            // Cria usuário atualizado
            const novoUsuario = {
                nome,
                email,
                acesso,
                senha,
                disciplina
            };

            // Guarda novo usuário no banco
            await api
                .inserirUsuario(novoUsuario)
                .then(res => {
                    window.alert("Usuário inserido com sucesso.");

                    if (foto) {
                        const formData = new FormData();
                        formData.append("foto", foto);
                        fetch(`http://localhost:5000/api/upload-profile/${res.data.id}`, {
                                method: 'POST',
                                body: formData
                            })
                            .then(res => res.json())
                            
                        // Limpa os campos
                        setUsuario(initialState);
                    }
                })
        }
    }  

    // Formulário - Criação
    return (
        <UserForm
            data={usuario}
            onSubmit={handleIncludeUser}
            setUsuario={setUsuario}
            typeForm="Registrar"
            edit={false}
            profDisciplinas={profDisciplinas}
            setProfDisciplinas={setProfDisciplinas}
        /> 
    );
}