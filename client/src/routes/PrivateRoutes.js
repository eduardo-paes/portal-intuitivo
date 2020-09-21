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

    let validation = true;
    let defaultURL = "/";

    // Verifica se o tipo de acesso é correto
    if (access === "Professor") {
        defaultURL = "/controle-conteudo";
    } else if (access === "Administrador") {
        defaultURL = "/controle-usuario";
        (type === "Professor") && (type = "Administrador")
    }

    // Verifica se o usuário que está tentando acessar o perfil é o propietário do mesmo
    if (rest.location.pathname.includes("perfil")) {
        // Pega o valor ID do parâmetro da rota
        let checkID = rest.location.pathname.split("/").map(item => {
            return item;
        })

        if (checkID[2] === token.userID) {
            validation = true;
        } else {
            validation = false;
        }
    }

    return (
        <Route
            {...rest}
            render={
                (props) => (access === type || validation)
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