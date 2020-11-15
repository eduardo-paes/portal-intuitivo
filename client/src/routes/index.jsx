import React, {useContext} from "react";
import {Route, Switch} from 'react-router-dom'
import {StorageProvider, StoreContext} from '../utils'
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
    Analysis,
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
    ActivityToCorrect,
    EssayToCorrect,
    TeacherAnalysis,
    AdminAnalysis,
    // AdminAnalysis,
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
    const {token} = useContext(StoreContext);
    const access = token.accessType;

    return (
        <Switch>
            {/* --- Rotas do Aluno */}
            <ConditionalRoute exact={true} type="Aluno" from="/" component={Home}/>
            <ConditionalRoute exact={true} type="Aluno" from="/plano-estudo" component={StudyPlan}/>
            <ConditionalRoute exact={true} type="Aluno" from="/dashboard" component={Dashboard}/>
            <ConditionalRoute exact={true} type="Aluno" from="/biblioteca" component={Library}/>
            <ConditionalRoute exact={true} type="Aluno" from="/desempenho" component={Analysis}/>
            <ConditionalRoute exact={true} type="Aluno" from="/classroom" component={Classroom}/> 
            <ConditionalRoute exact={true} type="Aluno" from="/perfil/:id" component={UsersUpdate}/>
            
            {/* --- Rotas do Professor */}
            <ConditionalRoute exact={true} type="Professor" from="/" component={ContentList}/>
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
            <ConditionalRoute exact={true} type="Professor" from="/controle-correcoes/atividades/:atividadeID" component={ActivityToCorrect}/>
            <ConditionalRoute exact={true} type="Professor" from="/controle-correcoes/redacao/:atividadeID" component={EssayToCorrect}/>

            {/* --- Rotas do Administrador */}
            <ConditionalRoute exact={true} type="Administrador" from="/" component={UsersList}/>
            <ConditionalRoute exact={true} type="Administrador" from="/controle-usuario" component={UsersList}/>
            <ConditionalRoute exact={true} type="Administrador" from="/controle-usuario/list" component={UsersList}/>
            <ConditionalRoute exact={true} type="Administrador" from="/controle-usuario/create" component={UsersInsert}/>
            <ConditionalRoute exact={true} type="Administrador" from="/controle-usuario/update/:id" component={UsersUpdate}/>
            <ConditionalRoute exact={true} type="Administrador" from="/configuracoes" component={Settings}/>

            {/* Rotas para análise das turmas de acordo com tipo de acesso */}
            <ConditionalRoute 
                exact={true} 
                type={access} 
                from="/analisar-desempenho/" 
                component={ (access === "Administrador") ? AdminAnalysis : (access === "Professor") ? TeacherAnalysis : Home }/>

            {/* Rotas gerais para caminhos inválidos */}
            <ConditionalRoute exact={true} type={access} from="*" component={null}/>
        </Switch>
    );
}

export {
    Routes,
    PrivateRoutes
}