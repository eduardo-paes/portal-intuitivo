import React, {Component} from 'react'
import {Link as RouterLink} from 'react-router-dom';

// -- Material UI
import {withStyles, styled} from '@material-ui/core/styles';
import {red, cyan} from '@material-ui/core/colors';
import {Typography, Container, TextField, Button, CardContent} from '@material-ui/core';

// Ícones: Material-UI
import AddIcon from '@material-ui/icons/Add';

// -- Button Styles
const AddButton = withStyles((theme) => ({
    root: {
        color: theme
            .palette
            .getContrastText(cyan[700]),
        backgroundColor: cyan[500],
        '&:hover': {
            backgroundColor: cyan[700]
        },
        margin: theme.spacing(1)
    }
}))(Button);

const DeleteButton = withStyles((theme) => ({
    root: {
        color: theme
            .palette
            .getContrastText(red[700]),
        backgroundColor: red[500],
        '&:hover': {
            backgroundColor: red[700]
        },
        margin: theme.spacing(1)
    }
}))(Button);

class CreateUser extends Component {
    render() {
        return (
            <div className="create-button">
                <RouterLink to="/controle-usuario/create">
                    <Button variant="outlined" color="primary" startIcon={<AddIcon/>}>
                        Registrar
                    </Button>
                </RouterLink>
            </div>
        )
    }
}

const MyTextField = styled(TextField)(
    {marginBottom: "10px", backgroundColor: "#fff", display: "flex", color: "primary"}
);

const MyContainer = styled(Container)(
    {padding: "50px", backgroundColor: "#fff"}
);

const MyTypography = styled(Typography)({margin: "5% 0 5% 0", padding: "1%"});

const MyCardContent = styled(CardContent)({ padding: "3% 15% 3% 15%" });

export {
    AddButton,
    CreateUser,
    DeleteButton,
    MyContainer,
    MyTextField,
    MyTypography,
    MyCardContent
}