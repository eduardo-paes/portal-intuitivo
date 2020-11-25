import React, {useEffect, useContext, useState} from 'react'
import {withRouter} from "react-router-dom";
import {StoreContext} from "../../utils"
import api from "../../api";

// -- Material UI: Core
import {Badge, List, ListItem, ListItemIcon, ListItemText, Divider} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

// -- Material UI: Icon
import Dashboard from '@material-ui/icons/Dashboard';
import StudyPlan from '@material-ui/icons/LibraryBooks';
import Library from '@material-ui/icons/MenuBook';
import Classroom from '@material-ui/icons/Class';
import Resultados from '@material-ui/icons/InsertChart';
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
        fontWeight: "500",
        fontSize: "0,9rem"
    }
}));

function ListarItens(props) {
    const {itens, classes, numCorrections} = props;

    return (
        <> 
        <Divider /> 
        <List>
            {
                itens.map(item => {
                    const {text, icon, onClick} = item;
                    return (
                        <ListItem button={true} key={text} onClick={onClick} className={classes.root}>
                             <Badge badgeContent={numCorrections} anchorOrigin={{ vertical: 'top', horizontal: 'left' }} max={99} invisible={text !== 'Correções' || numCorrections === 0} color="secondary">
                                <ListItemIcon className={classes.root}>{icon}</ListItemIcon>
                                <ListItemText className={classes.root} primary={text} disableTypography={true}/>
                             </Badge>
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
    const [numCorrections, setNumCorrections] = useState(0);
    const [wasLoaded, setWasLoaded] = useState(false);
    const { token, setToken } = useContext(StoreContext);
    const disciplinas = token.disciplina;

    const handleLogout = () => {
        setToken(null);
        history.push('/login');
    };

    const itens = {
        aluno: [
            {
                text: "Dashboard",
                icon: <Dashboard/>,
                onClick: () => history.push("/dashboard")
            }, {
                text: "Plano de Estudos",
                icon: <StudyPlan/>,
                onClick: () => history.push("/plano-estudo")
            }, {
                text: "Biblioteca",
                icon: <Library/>,
                onClick: () => history.push("/biblioteca")
            }, {
                text: "Classroom",
                icon: <Classroom/>,
                onClick: () => history.push("/classroom")
            }, {
                text: "Resultados",
                icon: <Resultados/>,
                onClick: () => history.push("/resultados")
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
    };

    useEffect(() => {
        const abortController = new AbortController();
    
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

        return abortController.abort();
        // eslint-disable-next-line
    }, [token]);

    useEffect(() => {
        // const abortController = new AbortController();
        if (disciplinas.length && !wasLoaded) {
            var count = 0;
            disciplinas.forEach(async item => {
                if (item.disciplinaID) {
                    const resRA = await api.contarRAsNaoCorrigidas(item.disciplinaID);
                    const resRED = await api.contarRedacoesNaoCorrigidas(item.disciplinaID);

                    const valRA = resRA.data;
                    const valRED = resRED.data;

                    count = valRA.success ? valRA.data : 0;
                    count = valRED.success ? valRED.data : 0;

                    setNumCorrections(numCorrections + count);
                }
            });
            setWasLoaded(true);
        }
        // return abortController.abort();
        // eslint-disable-next-line
    }, [disciplinas])

    return (
        <div>
            {access.aluno && <ListarItens itens={itens.aluno} classes={classes}/>}
            {access.professor && <ListarItens numCorrections={numCorrections} itens={itens.professor} classes={classes}/>}
            {access.admin && <ListarItens itens={itens.admin} classes={classes}/>}
            {access.geral && <ListarItens itens={itens.geral} classes={classes}/>}
        </div>
    );
}
export default withRouter(ItemsDrawer);
