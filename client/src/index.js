import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Routes } from "./routes";

// -- Styles
import "./assets/styles/global.css";
import { ThemeProvider } from '@material-ui/core/styles';
import theme from "./assets/styles/theme"

const script = document.createElement("script");
  script.src ='https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image;'
  script.async = true;
  document.body.appendChild(script);

ReactDOM.render(
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <Routes/>
            </ThemeProvider>
        </BrowserRouter>,
    document.getElementById('root')
);