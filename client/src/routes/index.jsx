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
    Home,
    Dashboard,
    Desempenho,
    Classroom,
    QuestionList,
    QuestionInsert,
    QuestionUpdate,
    ActivityList,
    ActivityInsert,
    ActivityUpdate,
    Login,
    GeneralPage,
    ContentInsert,
    ContentUpdate,
    ContentList,
    Settings,
    Correction,
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
            <ConditionalRoute exact={true} type="Aluno" from="/" component={Home}/>
            <ConditionalRoute exact={true} type="Aluno" from="/plano-estudo" component={StudyPlan}/>
            <ConditionalRoute exact={true} type="Aluno" from="/dashboard" component={Dashboard}/>
            <ConditionalRoute exact={true} type="Aluno" from="/biblioteca" component={Library}/>
            <ConditionalRoute exact={true} type="Aluno" from="/desempenho" component={Desempenho}/>
            <ConditionalRoute exact={true} type="Aluno" from="/classroom" component={Classroom}/> 
            <ConditionalRoute exact={true} type="Aluno" from="/perfil/:id" component={UsersUpdate}/>
            
            {/* --- Rotas do Professor */}
            <ConditionalRoute exact={true} type="Professor" from="/controle-conteudo" component={ContentList}/>
            <ConditionalRoute exact={true} type="Professor" from="/controle-conteudo/create" component={ContentInsert}/>
            <ConditionalRoute exact={true} type="Professor" from="/controle-conteudo/update/:id" component={ContentUpdate}/>
            <ConditionalRoute exact={true} type="Professor" from="/controle-questoes" component={QuestionList}/>
            <ConditionalRoute exact={true} type="Professor" from="/controle-questoes/list" component={QuestionList}/>
            <ConditionalRoute exact={true} type="Professor" from="/controle-questoes/create" component={QuestionInsert}/>
            <ConditionalRoute exact={true} type="Professor" from="/controle-questoes/update/:id" component={QuestionUpdate}/>
            <ConditionalRoute exact={true} type="Professor" from="/controle-atividade" component={ActivityList}/>
            <ConditionalRoute exact={true} type="Professor" from="/controle-atividade/list" component={ActivityList}/>
            <ConditionalRoute exact={true} type="Professor" from="/controle-atividade/create" component={ActivityInsert}/>
            <ConditionalRoute exact={true} type="Professor" from="/controle-atividade/update/:id" component={ActivityUpdate}/>
            <ConditionalRoute exact={true} type="Professor" from="/controle-revisao/update/:id" component={ActivityUpdate}/>
            <ConditionalRoute exact={true} type="Professor" from="/controle-correcoes" component={Correction}/>

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