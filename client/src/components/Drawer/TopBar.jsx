import React from "react";

// -- Componentes
import logo from "../../assets/images/TopLogo.png"

// -- Material-UI
import clsx from "clsx";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles, AppBar, Grid, Toolbar, IconButton } from "@material-ui/core";
import "./styles.css"

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
        width: "9.375rem",
        minWidth: "9.375rem",
        height: "1.875rem",
        minHeight: "1.875rem",
        margin: "0.5rem",
    },
    menuButton: {
        marginRight: theme.spacing(2),
        backgroundColor: "inherit",
        color: "#fff"
    },
    hide: {
        display: "none"
    },
    title: {
        flexGrow: 1,
        display: "block",
        textAlign: "center",
        alignSelf: "center"
    }
}));

export default function TopBar(props) {
    const classes = useStyles();
    const {open, setOpen} = props;

    return (
        <view className={classes.topBar}>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open
                })}>

                <Toolbar style={{minWidth: drawerWidth}}>
                    <Grid container={true}>

                        <Grid item={true} xs={2} sm={2}>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={() => setOpen(true)}
                                edge="start"
                                className={clsx(classes.menuButton, open && classes.hide)}>
                                    <MenuIcon/>
                            </IconButton>
                        </Grid>

                        <Grid item={true} className={classes.title} xs={8} sm={8}>
                            <img className={classes.logo} src={logo} alt="Logo"/>
                        </Grid>

                        <Grid item={true} hidden={true} xs={2} sm={2}>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start">
                                    <MenuIcon/>
                            </IconButton>
                        </Grid>

                    </Grid>
                </Toolbar>
            </AppBar>
        </view>
    );
}