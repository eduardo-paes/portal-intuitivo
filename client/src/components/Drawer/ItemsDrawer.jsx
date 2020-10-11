import React, {useEffect, useContext, useState} from 'react'
import {withRouter} from "react-router-dom";
import {StoreContext} from "../../utils"

// -- Material UI: Core
import {List, ListItem, ListItemIcon, ListItemText, Divider} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

// -- Material UI: Icon
import Dashboard from '@material-ui/icons/Dashboard';
import StudyPlan from '@material-ui/icons/LibraryBooks';
import Library from '@material-ui/icons/MenuBook';
import Classroom from '@material-ui/icons/Class';
// --
import Analize from '@material-ui/icons/Timeline';
import Exercises from '@material-ui/icons/Ballot';
import Questions from '@material-ui/icons/Storage';
import Correction from '@material-ui/icons/AssignmentTurnedIn';
import ContentControl from '@material-ui/icons/InsertDriveFile';
// --
import UserControl from '@material-ui/icons/People';
import Settings from '@material-ui/icons/Settings';
// -- 
import Logout from '@material-ui/icons/ExitToApp';
import Profile from '@material-ui/icons/AccountBox';

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
    const [access, setAccess] = useState({geral: true});
    const { token, setToken } = useContext(StoreContext);

    function handleLogout () {
        setToken(null);
        history.push('/login');
    };

    const itens = {
        aluno: [
            {
                text: "Dashboard",
                icon: <Dashboard/>,
                onClick: () => history.push("/dashboard")
            },
            {
                text: "Plano de Estudos",
                icon: <StudyPlan/>,
                onClick: () => history.push("/plano-estudo")
            }, {
                text: "Biblioteca",
                icon: <Library/>,
                onClick: () => history.push("/biblioteca")
            },{
                text: "Classroom",
                icon: <Classroom/>,
                onClick: () => history.push("/classroom")
            },
        ],
        professor: [
            {
                text: "Análises",
                icon: <Analize/>,
                onClick: () => history.push("/analisar-desempenho")
            }, {
                text: "Atividades",
                icon: <Exercises/>,
                onClick: () => history.push("/controle-atividade")
            }, {
                text: "Banco de Questões",
                icon: <Questions/>,
                onClick: () => history.push("/controle-questoes")
            }, {
                text: "Correções",
                icon: <Correction/>,
                onClick: () => history.push("/controle-correcoes")
            }, {
                text: "Material de Estudo",
                icon: <ContentControl/>,
                onClick: () => history.push("/controle-conteudo")
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
        ],
        geral: [
            {
                text: "Perfil",
                icon: <Profile/>,
                onClick: () => history.push(`/perfil/${token.userID}`)
            }, {
                text: "Sair",
                icon: <Logout/>,
                onClick: () => handleLogout()
            }
        ]
    }

    useEffect(() => {
        if (token.accessType === "Aluno") {
            setAccess(preValue => ({
                ...preValue,
                aluno: true,
            }));
        }

        else if (token.accessType === "Professor") {
            setAccess(preValue => ({
                ...preValue,
                professor: true,
            }));
        } 
        
        else if (token.accessType === "Administrador") {
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
            {access.geral && <ListarItens itens={itens.geral} classes={classes}/>}
        </div>
    );
}
export default withRouter(ItemsDrawer);
