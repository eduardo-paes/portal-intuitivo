import React from "react";

// -- Material UI: Core
import {List, ListItem, ListItemIcon, ListItemText, Divider} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

// -- Material UI: Icon
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
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

    return (
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
    );
}

function ItemsLink(props) {
    const {history} = props;
    const classes = useStyles();
    const itensAluno = [
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
    ]

    const itensAdmin = [
        {
            text: "Controle de Usuário",
            icon: <PeopleIcon/>,
            onClick: () => history.push("/controle-usuario")
        }
    ]

    return (
        <div>
            <ListarItens itens={itensAluno} classes={classes}/>
            <Divider/>
            <ListarItens itens={itensAdmin} classes={classes}/>
        </div>
    );
}

export default withRouter(ItemsLink);