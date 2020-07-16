// eslint-disable-next-line

import React, {useEffect, useContext, useState} from 'react'
import StoreContext from "../Store/Context"

// -- Material UI: Core
import {List, ListItem, ListItemIcon, ListItemText, Divider} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

// -- Material UI: Icon
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import TimelineIcon from '@material-ui/icons/Timeline';
import SettingsIcon from '@material-ui/icons/Settings';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import ClassIcon from '@material-ui/icons/Class';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import PeopleIcon from '@material-ui/icons/People';
import {withRouter} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    root: {
        color: "#fff",
        fontWeight: "700",
        fontSize: "0,9rem"
    }
}));

function ListarItens(props) {
    const {itens, classes} = props;
    console.log("Esse", itens)

    return (
        <> 
        <Divider /> 
        <List>
            {
                itens.map(item => {
                    const {text, icon, onClick} = item;
                    return (
                        <ListItem button={true} key={text} onClick={onClick} className={classes.root}>
                            <ListItemIcon className={classes.root}>{icon}</ListItemIcon>
                            <ListItemText className={classes.root} primary={text} disableTypography={true}/>
                        </ListItem>
                    )
                })
            }
        </List>
    </>
    );
}

function ItemsDrawer(props) {
    const {history} = props;
    const classes = useStyles();
    const itens = {
        aluno: [
            {
                text: "Dashboard",
                icon: <LibraryBooksIcon/>,
                onClick: () => history.push("/dashboard")
            }, {
                text: "Classroom",
                icon: <ClassIcon/>,
                onClick: () => history.push("/classroom")
            }, {
                text: "Meu desempenho",
                icon: <EqualizerIcon/>,
                onClick: () => history.push("/desempenho")
            }
        ],
        professor: [
            {
                text: "Criar Conteúdo",
                icon: <NoteAddIcon/>,
                onClick: () => history.push("/criar-conteúdo")
            }, {
                text: "Análises",
                icon: <TimelineIcon/>,
                onClick: () => history.push("/analisar-desempenho")
            }
        ],
        admin: [
            {
                text: "Controle de Usuário",
                icon: <PeopleIcon/>,
                onClick: () => history.push("/controle-usuario")
            }, {
                text: "Configurações",
                icon: <SettingsIcon/>,
                onClick: () => history.push("/configuracoes")
            }
        ]
    }
    const [access, setAccess] = useState({aluno: true});
    const {token} = useContext(StoreContext);

    useEffect(() => {
        if (token.accessType === "Professor") {
            setAccess(preValue => ({
                ...preValue,
                professor: true
            }));
        } else if (token.accessType === "Administrador") {
            setAccess(preValue => ({
                ...preValue,
                professor: true,
                admin: true
            }));
        }

    }, [token]);

    return (
        <div>
            {access.aluno && <ListarItens itens={itens.aluno} classes={classes}/>}
            {access.professor && <ListarItens itens={itens.professor} classes={classes}/>}
            {access.admin && <ListarItens itens={itens.admin} classes={classes}/>}
            <Divider/>
        </div>
    );
}

export default withRouter(ItemsDrawer);