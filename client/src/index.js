import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";
import { Routes } from "./components";

// -- Styles
import "./styles/styles.css";
import { ThemeProvider } from '@material-ui/core/styles';
import theme from "./styles/theme"

ReactDOM.render(
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <Routes/>
            </ThemeProvider>
        </BrowserRouter>,
    document.getElementById('root')
);
