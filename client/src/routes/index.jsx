import React from "react";
import {Route, Switch} from 'react-router-dom'
import {StorageProvider} from '../utils'
import {RoutesPrivate, ConditionalRoute} from "./PrivateRoutes"

// -- Páginas
import {
    UsersList,
    UsersInsert,
    UsersUpdate,
    StudyPlan,
    Library,
    Desempenho,
    Classroom,
    ActivityInsert,
    QuestionInsert,
    Login,
    GeneralPage,
    ContentInsert,
    ContentUpdate,
    ContentList,
    Settings,
    QuestionList
} from '../pages'

// -- Main Routes
function Routes() {
    return (
        <StorageProvider>
            <Switch>
                <Route path="/login" component={Login}/>
                <RoutesPrivate path="/" component={GeneralPage}/>
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
            <ConditionalRoute exact={true} type="Professor" from="/controle-conteudo" component={ContentList}/>
            <ConditionalRoute exact={true} type="Professor" from="/atividades" component={ActivityInsert}/>
            <ConditionalRoute exact={true} type="Professor" from="/controle-conteudo/create" component={ContentInsert}/>
            <ConditionalRoute exact={true} type="Professor" from="/controle-conteudo/update" component={ContentUpdate}/>
            <ConditionalRoute exact={true} type="Professor" from="/controle-questoes" component={QuestionList}/>
            <ConditionalRoute exact={true} type="Professor" from="/controle-questoes/create" component={QuestionInsert}/>

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