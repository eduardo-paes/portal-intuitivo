import React, {useContext} from "react";
import {Route, Redirect} from "react-router-dom"
import {StoreContext} from "../utils"

// -- Definição de modelo de rota privada exigindo token para acesso
// Rotas privadas de acesso
const RoutesPrivate = ({ component: Component, ...rest }) => {
    const {token} = useContext(StoreContext);

    return (
        <Route
            {...rest}
            render={
                (props) => token
                ? <Component {...props}/>
                : <Redirect to="/login"/>
            }
        />
    )
}

// Rotas privadas para cada tipo de acesso
const ConditionalRoute = ({ component: Component, type, ...rest }) => {
    const {token} = useContext(StoreContext);
    const access = token.accessType;

    let defaultURL = "/";

    if (access === "Professor") {
        defaultURL = "/controle-conteudo";
    } else if (access === "Administrador") {
        defaultURL = "/controle-usuario";
        type === "Professor" && (type = "Administrador")
        
    }

    return (
        <Route
            {...rest}
            render={
                (props) => (access === type)
                ? <Component {...props}/>
                : <Redirect to={defaultURL}/>
            }
        />
    )
}

export {
    RoutesPrivate,
    ConditionalRoute
};