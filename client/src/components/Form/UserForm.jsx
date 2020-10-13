import React, { useState, useEffect } from 'react';
import { Link } from '../../../node_modules/react-router-dom'
import { AddButton, DeleteButton, MyAvatar, MyTextField, MyContainer, GeneralTitle } from "../../assets/styles/styledComponents"
import { MenuItem, Grid, Fab, makeStyles } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

// Upload da Imagem do Perfil
import Upload from "../Upload/Upload";
import "./Styles/styleUserForm.css"
import api from '../../api';

const useStyles = makeStyles((theme) => ({
    fabButton: {
        marginTop: '0.4rem', 
        marginLeft: "1.2rem",
        [theme.breakpoints.down('sm')]: {
            marginLeft: "0.8rem",
        }
    },
    errorMessage: {
        fontSize: "0.75rem",
        paddingLeft: "1rem",
        color: "#f44336"
    }
}));

export default function UserForm (props) {
    const { data, setUsuario, onSubmit, typeForm, edit, profDisciplinas, setProfDisciplinas } = props;
    const { nome, email, acesso, senha, erros, url } = data;

    const classes = useStyles();
    const [listaDisciplina, setListaDisciplina] = useState([]);
    const [subjectLoading, setSubjectLoading] = useState(true);
    
    // Guarda o dado vindo do input
    const handleChange = (event) => {
        const {name, value} = event.target;
        setUsuario(preValue => ({
            ...preValue,
            [name]: value
        }));
    }

    // Guarda o dado vindo do upload da imagem de perfil
    const handleUpload = async (event) => {
        const file = await event.target.files[0];
        setUsuario(preValue => ({
            ...preValue,
            url: URL.createObjectURL(file),
            foto: file
        }));
    }

    // -- Faz alterações em disciplina do professor
    const handleSubjectChange = (position, value) => {
        const updatedSubjectItems = profDisciplinas.map((item, index) => {
          if (index === position) {
            return { ...item, disciplinaID: value };
          }
          
          return item;
        });
        setProfDisciplinas(updatedSubjectItems);
    }

    // -- Adiciona novo campo para disciplina
    const addNewSubject = () => {
        setProfDisciplinas([
          ...profDisciplinas,
          { disciplinaID: '', }
        ]);
    }

    // -- Remover disciplina
    const deleteThisSubject = (event, position) => {
        setProfDisciplinas(profDisciplinas.filter((value, index) => {
            return index !== position;
        }));
    }

    // -- Caso o usuário seja do tipo professor, permite que sejam escolhidas disciplinas
    useEffect(() => {
        const abortController = new AbortController();
        if (acesso === 'Professor' && subjectLoading) {
            async function fetchDisciplinaAPI() {
                const response = await api.listarDisciplinas();
                const value = response.data;
                if (value.success) {
                    setListaDisciplina(value.data);
                }
            }
            fetchDisciplinaAPI();
            setSubjectLoading(false);
        }
        return abortController.abort();
        // eslint-disable-next-line
    }, [acesso])

    // -- Salva alterações de disciplina do professor no campo 'disciplina' do usuário
    useEffect(() => {
        const abortController = new AbortController();
        const disciplinasCorrigidas = profDisciplinas.filter(item => {
            return item.disciplinaID !== undefined;
        })
        setUsuario(preValue => ({
            ...preValue,
            disciplina: disciplinasCorrigidas
        }))
        return abortController.abort();
        // eslint-disable-next-line
    }, [profDisciplinas])

    return (
        <MyContainer>
            <section id="headerUserForm">
                <GeneralTitle>{typeForm} Usuário</GeneralTitle>
            </section>

            <section id="bodyUserForm">
                <Grid container={true} spacing={2} justify="center">
                    <Grid item={true} xl={8} xs={12} sm={9} className="uploadImage">
                        <MyAvatar src={url} alt="Preview"/>
                        <Upload onUpload={handleUpload} />
                    </Grid>

                    <Grid item={true} xl={8} xs={12} sm={9}>
                        <MyTextField
                            id="userNameInput"
                            label="Nome"
                            variant="outlined"
                            name="nome"
                            type="text"
                            value={nome}
                            autoFocus={true}
                            onChange={handleChange}
                            error={erros.nome ? true : false}/>
                        {erros.nome && <p className={classes.errorMessage}>{erros.nome}</p>}

                        <MyTextField
                            id="userEmailsInput"
                            label="E-mail"
                            variant="outlined"
                            name="email"
                            type="email"
                            value={email}
                            onChange={handleChange}
                            error={erros.email ? true : false}/>
                        {erros.email && <p className={classes.errorMessage}>{erros.email}</p>}
                        
                        <MyTextField
                            id="userAccessInput"
                            select={true}
                            label="Acesso"
                            name="acesso"
                            type="text"
                            value={acesso}
                            onChange={handleChange}
                            variant="outlined"
                            error={erros.acesso ? true : false}>
                                <MenuItem value="Aluno">Aluno</MenuItem>
                                <MenuItem value="Professor">Professor</MenuItem>
                                <MenuItem value="Administrador">Administrador</MenuItem>
                        </MyTextField>
                        {erros.acesso && <p className={classes.errorMessage}>{erros.acesso}</p>}

                        {
                            (acesso === "Professor") && profDisciplinas.map((item, index) => {
                                let tam = profDisciplinas.length;
                                return (
                                    <Grid key={index} container={true}>
                                        <Grid item={true} xs={10} sm={11}>
                                            <MyTextField
                                                select={true}
                                                label="Disciplina"
                                                name="disciplina"
                                                value={item.disciplinaID}
                                                hidden={acesso !== "Professor" ? true : false}
                                                variant="outlined"
                                                onChange={e => handleSubjectChange(index, e.target.value)}
                                                fullWidth={true}
                                                error={erros.disciplina ? true : false}>
                                                    {
                                                        listaDisciplina.map((row, disKey) => {
                                                            return <MenuItem key={disKey} value={row._id}>{row.nome}</MenuItem>
                                                        })
                                                    }
                                            </MyTextField>
                                            {erros.disciplina && <p className={classes.errorMessage}>{erros.disciplina}</p>}
                                        </Grid>

                                        <Grid item={true} xs={2} sm={1}>
                                            {index === tam-1 
                                                ?   <Fab className={classes.fabButton} onClick={addNewSubject} size="small" color="primary" aria-label="add">
                                                        <AddIcon />
                                                    </Fab>
                                                :   <Fab className={classes.fabButton} onClick={(event) => deleteThisSubject (event, index)} size="small" color="secondary" aria-label="add">
                                                        <DeleteIcon />
                                                    </Fab>
                                            } 
                                        </Grid>
                                    </Grid>
                                )
                            })
                        }

                        <MyTextField
                            id="userPasswordInput"
                            label="Senha"
                            variant="outlined"
                            name="senha"
                            type="password"
                            value={senha ? senha : ''}
                            onChange={handleChange}
                            error={erros.senha ? true : false}
                            InputLabelProps={edit ? {shrink: true} : null}/>
                        {erros.senha && <p className={classes.errorMessage}>{erros.senha}</p>}
                    </Grid>
                </Grid>
            </section>

            <section id="footerUserForm" className="group-buttons">
                <AddButton onClick={onSubmit}>{typeForm}</AddButton>
                <Link to="/controle-usuario/list" style={{ textDecoration: 'none' }}>
                    <DeleteButton>Cancelar</DeleteButton>
                </Link>
            </section>
        </MyContainer>
    )
}