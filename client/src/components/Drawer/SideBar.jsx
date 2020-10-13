import React from "react";

// -- Componentes
import ItemsDrawer from "./ItemsDrawer"
import ProfileMenu from "./ProfileMenu"

// -- Material-UI
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { cyan } from "@material-ui/core/colors";
import { makeStyles, useTheme, Drawer, IconButton, Grid } from "@material-ui/core";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: cyan[500]
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: "flex-end"
    }
}));

export default function SideBar(props) {
    const {open, setOpen} = props;
    const classes = useStyles();
    const theme = useTheme();

    return (
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
                paper: classes.drawerPaper
            }}>

            {/* Dados do topo da barra lateral */}
            <Grid container={true} justify="center">
                {/* Menu e Avatar do usuário */}
                <Grid item={true} xs={6} sm={6}> 
                    <ProfileMenu/>
                </Grid>

                {/* Ícone superior da Drawer Lateral */}
                <Grid item={true} xs={6} sm={6} className={classes.drawerHeader}>
                    <IconButton onClick={() => setOpen(false)}>
                        { theme.direction === "ltr"
                            ? (<ChevronLeftIcon/>)
                            : (<ChevronRightIcon/>)
                        }
                    </IconButton>
                </Grid>
            </Grid>

            {/* Itens da Drawer Lateral */}
            <ItemsDrawer/>
        </Drawer>
    );
}