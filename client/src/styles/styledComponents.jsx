import React, {Component} from 'react'
import {Link as RouterLink} from 'react-router-dom';

// -- Material UI
import {withStyles, styled} from '@material-ui/core/styles';
import {red, cyan} from '@material-ui/core/colors';
<<<<<<< HEAD
import {
    Avatar,
    Typography,
    Container,
    TextField,
    Button,
    CardContent,
    Card
} from '@material-ui/core';
=======
import {Typography, Container, TextField, Button, CardContent, Card} from '@material-ui/core';
>>>>>>> Adicionando tela de login

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
<<<<<<< HEAD

=======
        
>>>>>>> Adicionando tela de login
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
<<<<<<< HEAD
    {padding: "20px 30px 50px 30px", margin: "0"}
);

const MyTypography = styled(Typography)(
    {marginBottom: "5%", padding: "1%", color: "#606161"}
);

const MyCardContent = styled(CardContent)(
    {padding: "15px", alignContent: "center", textAlign: "center"}
);

const MyCard = styled(Card)({backgroundColor: "transparent"});
=======
    {padding: "20px 50px 50px 50px", backgroundColor: "#fff"}
);

const MyTypography = styled(Typography)({marginBottom: "5%", padding: "1%"});

const MyCardContent = styled(CardContent)(
    {padding: "30px 30px 0 30px", alignContent: "center", textAlign: "center"}
);

const MyCard = styled(Card)(
    {marginTop: "15%"}
);
>>>>>>> Adicionando tela de login

const MyAvatar = styled(Avatar) (
    {
        marginLeft: "60px",
        width: "150px",
        height: "150px"
    }
)

export {
    AddButton,
    CreateUser,
    DeleteButton,
    MyContainer,
    MyTextField,
    MyTypography,
    MyCardContent,
    MyCard,
    MyAvatar
}