import React, {useEffect, useContext, useState} from 'react'
import {withRouter} from "react-router-dom";
import {StoreContext} from "../../utils"

// -- Material UI: Core
import {List, ListItem, ListItemIcon, ListItemText, Divider} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

// -- Material UI: Icon
import StudyPlan from '@material-ui/icons/LibraryBooks';
import Library from '@material-ui/icons/MenuBook';
import Classroom from '@material-ui/icons/Class';
import Performance from '@material-ui/icons/Equalizer';
// --
import ContentControl from '@material-ui/icons/NoteAdd';
import Analize from '@material-ui/icons/Timeline';
import Exercises from '@material-ui/icons/Ballot';
import Questions from '@material-ui/icons/Storage';
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
                text: "Atividades",
                icon: <Exercises/>,
                onClick: () => history.push("/controle-atividades")
            }, {
                text: "Material de Estudo",
                icon: <ContentControl/>,
                onClick: () => history.push("/controle-conteudo")
            }, {
                text: "Banco de Questões",
                icon: <Questions/>,
                onClick: () => history.push("/controle-questoes")
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
            setAccess({professor: true});
        } else if (token.accessType === "Administrador") {
            setAccess({
                professor: true,
                admin: true
            });
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