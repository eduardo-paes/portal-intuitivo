import React, {useContext} from 'react';
import {useHistory} from 'react-router-dom';

import {StoreContext} from "../../utils";
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { Avatar } from '@material-ui/core';

// Esta função retorna o ícone e menu do usuário na barra de topo 
// contendo funções de logout e edição de perfil

export default function ProfileMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const profileOpen = Boolean(anchorEl);

    const { token, setToken } = useContext(StoreContext)
    console.log(token);
    const history = useHistory();

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        setToken(null);
        history.push('/login');
    };

    return (
        <div>
        <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit">
            <Avatar sizes="small" src={`http://localhost:5000/uploads/profile/${token.userID}.jpeg`} alt="Preview"/>
        </IconButton>
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
            onClose={handleClose}>
            <MenuItem onClick={handleClose}>Perfil</MenuItem>
            <MenuItem button={true} onClick={handleLogout}>Sair</MenuItem>
        </Menu>
    </div>
    );
}