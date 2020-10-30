import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes } from "../routes";

// -- Styles
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from "../assets/styles/theme"
import "../assets/styles/global.css";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
            <Routes/>
        </BrowserRouter>
    </ThemeProvider >
  );
}