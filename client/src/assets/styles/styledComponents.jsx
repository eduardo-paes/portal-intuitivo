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

const YellowButton = withStyles((theme) => ({
    root: {
        color: theme.palette.getContrastText("#ffc010"),
        backgroundColor: "#ffc010",
        '&:hover': {
            backgroundColor: "#daa40d",
        },
    },
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
    marginBottom: "0.625rem", 
    backgroundColor: "#fff", 
    display: "flex", 
    color: "primary"
});

const MyContainer = styled(Container)({
    padding: "1.2rem 1.875rem 1.2rem 1.875rem", 
    margin: "0"
});

const MyTypography = styled(Typography)({
    marginBottom: "5%", 
    padding: "1%", 
    color: "#606161"
});

const LoginCard = styled(CardContent)({
    padding: "0.94rem", 
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
    marginLeft: "3.75rem",
    width: "9.375rem",
    height: "9.375rem"
})

export {
    AddButton,
    CreateButton,
    YellowButton,
    DeleteButton,
    MyContainer,
    MyTextField,
    MyTypography,
    LoginCard,
    MyCard,
    MyCardContent,
    MyAvatar
}