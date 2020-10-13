import React from 'react'
import { Link } from 'react-router-dom';

// -- Material UI
import { withStyles, styled } from '@material-ui/core/styles';
import { red, cyan, green } from '@material-ui/core/colors';
import { Avatar, Typography, Container, TextField, Button, CardContent, Card } from '@material-ui/core';

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

const GreenButton = withStyles((theme) => ({
    root: {
        color: theme.palette.getContrastText(green[700]),
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
}))(Button);

const CreateButton = (props) => {
    const {title, url} = props;
    return (
        <Link to={url} style={{ textDecoration: 'none' }}>
            <Button variant="outlined" color="primary" startIcon={<AddIcon/>}>
                {title}
            </Button>
        </Link>
    )
}  

// -- Title Styles
const GeneralTitle = withStyles((theme) => ({
    root: {
        color: "#606161",
        fontStyle: 'normal',
        fontWeight: '500',
        marginBottom: '1rem',
        fontSize: "2rem",
    },
}))(Typography);

const GeneralSubtitle = withStyles((theme) => ({
    root: {
        color: "#606161",
        fontStyle: 'normal',
        fontWeight: '500',
        marginBottom: '1rem',
        fontSize: "1.5rem"
    },
}))(Typography);

// -- Others
const MyTextField = styled(TextField)({
    marginBottom: "0.625rem", 
    backgroundColor: "#fff", 
    display: "flex", 
    color: "primary",
    minWidth: 0
});

const MyContainer = styled(Container)({
    justifyContent: "center",
    justifySelf: "center",
    justifyItems: "center",
    padding: "1.2rem 1.875rem 1.2rem 1.875rem",
    margin: "0",
    maxWidth: "none",
    maxHeight: "none",
    minWidth: "18.75rem",
});

const MyTypography = styled(Typography)({ color: "#606161" });

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
    margin: "0",
    padding: "0", 
    alignContent: "left", 
    textAlign: "left"
});

const MyAvatar = styled(Avatar) ({
    width: "9.375rem",
    height: "9.375rem"
})

const QuestionNumeration = withStyles((theme) => ({
    root: {
        color: "#606161",
        fontStyle: 'normal',
        fontWeight: '700',
        marginTop: '1rem',
        fontSize: "1rem"
    },
}))(Typography);

export {
    AddButton,
    CreateButton,
    YellowButton,
    GreenButton,
    DeleteButton,
    MyContainer,
    MyTextField,
    MyTypography,
    LoginCard,
    MyCard,
    MyCardContent,
    MyAvatar,
    GeneralTitle,
    GeneralSubtitle,
    QuestionNumeration
}