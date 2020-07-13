import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";
import App from './app/index';

import { ThemeProvider } from '@material-ui/core/styles';
import theme from "./styles/theme"

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <App/>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById(
        'root'
    )
);
