import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router} from "react-router-dom";
import App from './app/index';

import { ThemeProvider } from '@material-ui/core/styles';
import theme from "./styles/theme"

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <ThemeProvider theme={theme}>
                <App/>
            </ThemeProvider>
        </Router>
    </React.StrictMode>,
    document.getElementById(
        'root'
    )
);
