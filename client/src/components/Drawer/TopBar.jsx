import React from "react";

// -- Componentes
import ProfileMenu from "./ProfileMenu"
import logo from "../../assets/images/TopLogo.png"

// -- Material-UI
import clsx from "clsx";
import MenuIcon from "@material-ui/icons/Menu";
import {
    makeStyles,
    AppBar,
    Toolbar,
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
            }),
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
            }),
        [theme.breakpoints.down('sm')]: {
            
        }
    },
    logo: {
        width: "10rem",
        minWidth: "10rem",
        height: "30px",
        minHeight: "30px"
    },
    menuButton: {
        marginRight: theme.spacing(2),
        backgroundColor: "inherit"
    },
    hide: {
        display: "none"
    },
    title: {
        flexGrow: 1,
        minWidth: '8rem',
        display: "block",
        textAlign: "center",
        paddingTop: "7px",
    }
}));

function TopBar(props) {
    const classes = useStyles();
    const {open, setOpen} = props;

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    return (
        <view className={classes.topBar}>
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

                    <div className={classes.title}>
                        <img className={classes.logo} src={logo} alt="Logo"/>
                    </div>

                    {/* Ícone e funções do usuário definida na top-bar */}
                    <ProfileMenu/>

                </Toolbar>
            </AppBar>
        </view>
    );
}

export default TopBar;