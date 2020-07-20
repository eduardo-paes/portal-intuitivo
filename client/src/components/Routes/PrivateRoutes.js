import React, {useContext} from "react";
import {Route, Redirect} from "react-router-dom"
import StoreContext from "../Store/Context"

// -- Definição de modelo de rota privada exigindo token para acesso
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

const AdminRoutes = ({ component: Component, ...rest }) => {
    const {token} = useContext(StoreContext);
    const access = token.accessType;

    return (
        <Route
            {...rest}
            render={
                (props) => (access === "Administrador")
                ? <Component {...props}/>
                : <Redirect to="/"/>
            }
        />
    )
}

const ProfRoutes = ({ component: Component, ...rest }) => {
    const {token} = useContext(StoreContext);
    const access = token.accessType;

    return (
        <Route
            {...rest}
            render={
                (props) => (access === "Professor" || access === "Administrador")
                ? <Component {...props}/>
                : <Redirect to="/"/>
            }
        />
    )
}

export {
    RoutesPrivate,
    ProfRoutes,
    AdminRoutes
};