import React from 'react'
import {Link as RouterLink} from 'react-router-dom';

// -- Material UI
import {withStyles, styled} from '@material-ui/core/styles';
import {red, cyan} from '@material-ui/core/colors';
import {
    Avatar,
    Typography,
    Container,
    TextField,
    Button,
    CardContent,
    Card
} from '@material-ui/core';

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

function CreateButton(props) {
    const {title, url} = props;
    return (
        <div className="create-button">
            <RouterLink to={url} style={{ textDecoration: 'none' }}>
                <Button variant="outlined" color="primary" startIcon={<AddIcon/>}>
                    {title}
                </Button>
            </RouterLink>
        </div>
    )
}    

// -- Others
const MyTextField = styled(TextField)({
    marginBottom: "10px", 
    backgroundColor: "#fff", 
    display: "flex", 
    color: "primary"
});

<<<<<<< HEAD
const FilterField = styled(TextField)(
    {marginBottom: "10px",height: "10px" ,backgroundColor: "#fff", display: "flex", color: "primary"}
);

const MyContainer = styled(Container)(
    {padding: "20px 30px 20px 30px", margin: "0"}
);
=======
const MyContainer = styled(Container)({
    padding: "20px 30px 20px 30px", 
    margin: "0"
});
>>>>>>> 2b6e6793fe0cb51efc0584e03b84fc2faabe7d72

const MyTypography = styled(Typography)({
    marginBottom: "5%", 
    padding: "1%", 
    color: "#606161"
});

const LoginCard = styled(CardContent)({
    padding: "15px", 
    alignContent: "center", 
    textAlign: "center"
});

const MyCard = styled(Card)({
    padding: "0", 
    margin: "0", 
    backgroundColor: "#fff"
});

const MyCardContent = styled(CardContent)({
    margin: "1rem",
    marginBottom: "0",
    padding: "0", 
    alignContent: "left", 
    textAlign: "left"
});

const MyAvatar = styled(Avatar) ({
    marginLeft: "60px",
    width: "150px",
    height: "150px"
})

export {
    AddButton,
    CreateButton,
    DeleteButton,
    FilterField,
    MyContainer,
    MyTextField,
    MyTypography,
    LoginCard,
    MyCard,
    MyCardContent,
    MyAvatar
}