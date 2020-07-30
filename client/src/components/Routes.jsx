import React from "react";
import {Route, Switch} from 'react-router-dom'
import {StorageProvider} from './'
import {RoutesPrivate, ConditionalRoute} from "./Routes/PrivateRoutes"

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
    HomeScreen,
    CreateContent
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
            <ConditionalRoute exact={true} type="Aluno" from="/" component={Dashboard}/>
            <ConditionalRoute exact={true} type="Aluno" from="/dashboard" component={Dashboard}/>
            <ConditionalRoute exact={true} type="Aluno" from="/desempenho" component={Desempenho}/>
            <ConditionalRoute exact={true} type="Aluno" from="/classroom" component={Classroom}/> 
            
            {/* --- Rotas do Professor */}
            <ConditionalRoute exact={true} type="Professor" from="/" component={Calendar}/>
            <ConditionalRoute exact={true} type="Professor" from="/calendario" component={Calendar}/>
            <ConditionalRoute exact={true} type="Professor" from="/criar-conteudo" component={CreateContent}/>

            {/* --- Rotas do Administrador */}
            <ConditionalRoute exact={true} type="Administrador" from="/" component={UsersList}/>
            <ConditionalRoute exact={true} type="Administrador" from="/controle-usuario" component={UsersList}/>
            <ConditionalRoute exact={true} type="Administrador" from="/controle-usuario/list" component={UsersList}/>
            <ConditionalRoute exact={true} type="Administrador" from="/controle-usuario/create" component={UsersInsert}/>
            <ConditionalRoute exact={true} type="Administrador" from="/controle-usuario/update/:id" component={UsersUpdate}/>
        </Switch>
    );
}

export {
    Routes,
    PrivateRoutes
}