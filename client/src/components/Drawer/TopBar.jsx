import React from "react";

// -- Componentes
import ProfileMenu from "./ProfileMenu"
<<<<<<< HEAD
import logo from "../../images/TopLogo.png"
=======
>>>>>>> Adicionando tela de login

// -- Material-UI
import clsx from "clsx";
import MenuIcon from "@material-ui/icons/Menu";
import {
    makeStyles,
    AppBar,
    Toolbar,
<<<<<<< HEAD
=======
    Typography,
>>>>>>> Adicionando tela de login
    IconButton
} from "@material-ui/core";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    appBar: {
        transition: theme
            .transitions
            .create([
                "margin", "width"
            ], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
            })
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme
            .transitions
            .create([
                "margin", "width"
            ], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen
            })
    },
<<<<<<< HEAD
    logo: {
        width: "150px",
        minWidth: "150px",
        height: "30px",
        minHeight: "30px"
    },
=======
>>>>>>> Adicionando tela de login
    menuButton: {
        marginRight: theme.spacing(2),
        backgroundColor: "inherit"
    },
    hide: {
        display: "none"
    },
    title: {
        flexGrow: 1,
<<<<<<< HEAD
        minWidth: drawerWidth,
        display: "block",
        textAlign: "center",
        paddingTop: "7px",
=======
        minWidth: drawerWidth
>>>>>>> Adicionando tela de login
    }
}));

function TopBar(props) {
    const classes = useStyles();
    const {open, setOpen} = props;

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    return (
        <>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open
                })}>

                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}>
                        <MenuIcon/>
                    </IconButton>

<<<<<<< HEAD
                    <div className={classes.title}>
                        <img className={classes.logo} src={logo} alt="Logo"/>
                    </div>

                    {/* <Typography variant="h6" className={classes.title}> Portal Intuitivo </Typography> */}
=======
                    <Typography variant="h6" className={classes.title}>
                        Portal Intuitivo
                    </Typography>
>>>>>>> Adicionando tela de login

                    {/* Ícone e funções do usuário definida na top-bar */}
                    <ProfileMenu/>

                </Toolbar>
            </AppBar>
        </>
    );
}

export default TopBar;