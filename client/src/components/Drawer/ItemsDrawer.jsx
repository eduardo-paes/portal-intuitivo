import React, {useEffect, useContext, useState} from 'react'
import {withRouter} from "react-router-dom";
import StoreContext from "../Store/Context"

// -- Material UI: Core
import {List, ListItem, ListItemIcon, ListItemText, Divider} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

// -- Material UI: Icon
import Dashboard from '@material-ui/icons/LibraryBooks';
import Classroom from '@material-ui/icons/Class';
import Performance from '@material-ui/icons/Equalizer';
// --
import AddContent from '@material-ui/icons/NoteAdd';
import Analize from '@material-ui/icons/Timeline';
import Calendar from '@material-ui/icons/EventNote';
// --
import UserControl from '@material-ui/icons/People';
import Settings from '@material-ui/icons/Settings';

const useStyles = makeStyles(theme => ({
    root: {
        color: "#fff",
        fontWeight: "700",
        fontSize: "0,9rem"
    }
}));

function ListarItens(props) {
    const {itens, classes} = props;

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
                icon: <Dashboard/>,
                onClick: () => history.push("/dashboard")
            }, {
                text: "Classroom",
                icon: <Classroom/>,
                onClick: () => history.push("/classroom")
            }, {
                text: "Meu desempenho",
                icon: <Performance/>,
                onClick: () => history.push("/desempenho")
            }
        ],
        professor: [
            {
                text: "Análises",
                icon: <Analize/>,
                onClick: () => history.push("/analisar-desempenho")
            }, {
                text: "Calendário",
                icon: <Calendar/>,
                onClick: () => history.push("/calendario")
            }, {
                text: "Criar Conteúdo",
                icon: <AddContent/>,
                onClick: () => history.push("/criar-conteúdo")
            }, 

        ],
        admin: [
            {
                text: "Controle de Usuário",
                icon: <UserControl/>,
                onClick: () => history.push("/controle-usuario")
            }, {
                text: "Configurações",
                icon: <Settings/>,
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