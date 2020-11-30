import React, { useState } from "react";
import {withRouter} from "react-router-dom";

// -- Componentes/Rotas
import {SideBar, TopBar} from "../../components"
import {PrivateRoutes} from "../../routes"

// -- Material-UI
import clsx from "clsx";
import {makeStyles} from "@material-ui/core";
import {CssBaseline} from "@material-ui/core";
import { GeneralText } from "../../assets/styles/styledComponents";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: "flex-end"
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(1),
        transition: theme
            .transitions
            .create("margin", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
            }),
        marginLeft: -drawerWidth
    },
    contentShift: {
        [theme.breakpoints.up('sm')]: {
            transition: theme
            .transitions
            .create("margin", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen
            }),
            marginLeft: 0,
        }
    },
    footer: {
        position: 'absolute',
        width: '99%',
        padding: '0.5rem 1.875rem',
        borderTop: '1px solid #ddd',
        [theme.breakpoints.down('sm')]: {
            padding: '0.5rem 0.7rem',
        },
    },
    footerText: {
        fontSize: '0.9rem',
        [theme.breakpoints.down('sm')]: {
            fontSize: '0.8rem',
        },
    },
    mainContent: {
        // [theme.breakpoints.up('xl')]: {
        //     minHeight: 900
        // },
        // [theme.breakpoints.up('lg')]: {
        //     minHeight: 800
        // },
        // [theme.breakpoints.up('md')]: {
        //     minHeight: 800
        // },
        // [theme.breakpoints.up('sm')]: {
        //     // minHeight: 600
        // },
        // [theme.breakpoints.up('xs')]: {
        // },
        [theme.breakpoints.down('xl')]: {
            minHeight: 500
        },
        [theme.breakpoints.up('xl')]: {
            minHeight: 800
        },
    }
}));

function HomeScreen(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <TopBar open={open} setOpen={setOpen}/>
            <SideBar open={open} setOpen={setOpen}/>
            <main className={clsx(classes.content, { [classes.contentShift]: open })}>
                <div className={classes.drawerHeader}/>
                <div className={classes.mainContent}>
                    <PrivateRoutes/>
                </div>
                <div className={classes.footer}>
                    <GeneralText className={classes.footerText}>Copyright © 2020 Curso Intuitivo. Todos os direitos reservados.</GeneralText>
                </div>
            </main>
        </div>
    );
}

export default withRouter(HomeScreen);