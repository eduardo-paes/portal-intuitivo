import React from "react";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {UsersList, UsersInsert, UsersUpdate} from '../pages'

// -- Styles
import 'fontsource-roboto';
import "../css/styles.css"

export default function LinkRoutes() {

    return (
        <Router>
            <Switch>
                <Route path="/controle-usuario/" exact={true} component={UsersList}/>
                <Route path="/controle-usuario/list" exact={true} component={UsersList}/>
                <Route path="/controle-usuario/create" exact={true} component={UsersInsert}/>
                <Route
                    path="/controle-usuario/update/:id"
                    exact={true}
                    component={UsersUpdate}/>
            </Switch>
        </Router>
    );
}