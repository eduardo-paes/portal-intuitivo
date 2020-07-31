import React from "react";
import {Route, Switch} from 'react-router-dom'
import {StorageProvider} from './'
import {RoutesPrivate, ConditionalRoute} from "./Routes/PrivateRoutes"

// -- Páginas
import {
    UsersList,
    UsersInsert,
    UsersUpdate,
    StudyPlan,
    Library,
    Desempenho,
    Classroom,
    Exercises,
    Login,
    HomeScreen,
    ContentInsert,
    Settings
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
            <ConditionalRoute exact={true} type="Aluno" from="/" component={StudyPlan}/>
            <ConditionalRoute exact={true} type="Aluno" from="/plano-estudo" component={StudyPlan}/>
            <ConditionalRoute exact={true} type="Aluno" from="/biblioteca" component={Library}/>
            <ConditionalRoute exact={true} type="Aluno" from="/desempenho" component={Desempenho}/>
            <ConditionalRoute exact={true} type="Aluno" from="/classroom" component={Classroom}/> 
            
            {/* --- Rotas do Professor */}
            <ConditionalRoute exact={true} type="Professor" from="/" component={ContentInsert}/>
            <ConditionalRoute exact={true} type="Professor" from="/atividades" component={Exercises}/>
            <ConditionalRoute exact={true} type="Professor" from="/controle-conteudo" component={ContentInsert}/>

            {/* --- Rotas do Administrador */}
            <ConditionalRoute exact={true} type="Administrador" from="/" component={UsersList}/>
            <ConditionalRoute exact={true} type="Administrador" from="/controle-usuario" component={UsersList}/>
            <ConditionalRoute exact={true} type="Administrador" from="/controle-usuario/list" component={UsersList}/>
            <ConditionalRoute exact={true} type="Administrador" from="/controle-usuario/create" component={UsersInsert}/>
            <ConditionalRoute exact={true} type="Administrador" from="/controle-usuario/update/:id" component={UsersUpdate}/>
            <ConditionalRoute exact={true} type="Administrador" from="/configuracoes" component={Settings}/>

        </Switch>
    );
}

export {
    Routes,
    PrivateRoutes
}