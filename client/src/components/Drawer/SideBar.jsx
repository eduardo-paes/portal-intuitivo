import React from "react";

// -- Componentes
import ItemsDrawer from "./ItemsDrawer"

// -- Material-UI
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import {cyan} from "@material-ui/core/colors";
import {
    makeStyles,
    useTheme,
    Drawer,
    IconButton
} from "@material-ui/core";

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

function SideBar(props) {
    const classes = useStyles();
    const theme = useTheme();
    const {open, setOpen} = props;

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper
                }}>
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {
                            theme.direction === "ltr"
                                ? (<ChevronLeftIcon/>)
                                : (<ChevronRightIcon/>)
                        }
                    </IconButton>
                </div>
                {/* Itens da Drawer Lateral */}
                <ItemsDrawer/>
            </Drawer>
        </>
    );
}

export default SideBar;