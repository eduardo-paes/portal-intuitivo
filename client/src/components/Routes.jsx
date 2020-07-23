import React from "react";
import {Route, Switch} from 'react-router-dom'
import {StorageProvider} from './'
import {RoutesPrivate, AdminRoutes, ProfRoutes} from "./Routes/PrivateRoutes"

// -- Páginas
import {
    UsersList,
    UsersInsert,
    UsersUpdate,
    Dashboard,
    Desempenho,
    Classroom,
    Calendar,
    Login,
    HomeScreen
} from '../pages'

// -- Main Routes
function Routes() {
    return (
        <StorageProvider>
            <Switch>
                <Route path="/login" component={Login}/>
                <RoutesPrivate path="/" component={HomeScreen}/>
            </Switch>
        </StorageProvider>
    );
}

// -- Private Routes
function PrivateRoutes() {

    return (
        <Switch>
            {/* --- Rotas do Aluno */}
            <RoutesPrivate exact={true} from="/" component={Dashboard}/>
            <RoutesPrivate exact={true} from="/dashboard" component={Dashboard}/>
            <RoutesPrivate exact={true} from="/desempenho" component={Desempenho}/>
            <RoutesPrivate exact={true} from="/classroom" component={Classroom}/> 
            
            {/* --- Rotas do Professor */}
            <ProfRoutes exact={true} from="/calendario" component={Calendar}/>

            {/* --- Rotas do Administrador */}
            <AdminRoutes exact={true} from="/controle-usuario/" component={UsersList}/>
            <AdminRoutes exact={true} from="/controle-usuario/list" component={UsersList}/>
            <AdminRoutes exact={true} from="/controle-usuario/create" component={UsersInsert}/>
            <AdminRoutes exact={true} from="/controle-usuario/update/:id" component={UsersUpdate}/>
        </Switch>
    );
}

export {
    Routes,
    PrivateRoutes
}