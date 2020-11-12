import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { StoreContext } from "../../utils";
import { makeStyles, Avatar, IconButton, Grid, MenuItem, Menu, Typography } from '@material-ui/core';

// Esta função retorna o ícone e menu do usuário na barra de topo 
// contendo funções de logout e edição de perfil

const useStyles = makeStyles((theme) => ({
    userName: {
        fontSize: "1rem",
        color: "#fff",
        fontWeight: "500",
        marginLeft: '0.5rem'
    }
}));

const userName = (nomeAluno) => {
    var name = nomeAluno.split(' ').map(name => {
        return name;
    })
    return name[0];
}

export default function ProfileMenu(props) {
    const classes = useStyles();
    const { token, setToken } = useContext(StoreContext)
    const [anchorEl, setAnchorEl] = useState(null);
    const [srcImg, setSrcImg] = useState('');
    console.log(token);
    
    const profileOpen = Boolean(anchorEl);
    const history = useHistory();
    const nomeAluno = userName(token.userName)

    function handleMenu (event) {
        setAnchorEl(event.currentTarget);
    };

    function handleProfile () {
        setAnchorEl(null);
        history.push(`/perfil/${token.userID}`);
    };

    function handleLogout () {
        setToken(null);
        history.push('/login');
    };

    useEffect(() => {
        setSrcImg(token.url)
    }, [token])

    return (
        <Grid container={true} style={{display: "flex"}} justify="center">
            <Grid item={true} xs={6} sm={6}>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    label="Nome"
                    color="inherit">
                        <Avatar sizes="small" src={srcImg} alt="Preview"/>
                </IconButton>
            </Grid>

            <Grid item={true} xs={6} sm={6} style={{alignSelf: "center"}}>
                <Typography className={classes.userName}>{nomeAluno}</Typography>
            </Grid>

            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                keepMounted={true}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                open={profileOpen}
                onClose={() => setAnchorEl(null)}>
                <MenuItem onClick={handleProfile}>Perfil</MenuItem>
                <MenuItem button={true} onClick={handleLogout}>Sair</MenuItem>
            </Menu>
        </Grid>
    );
}