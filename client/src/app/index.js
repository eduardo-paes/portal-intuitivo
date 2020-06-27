import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import {UsersList, UsersInsert, UsersUpdate} from '../pages'

// import 'bootstrap/dist/css/bootstrap.min.css'

import "../css/styles.css"

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/controle-usuario/" exact="exact" component={UsersList}/>
                <Route path="/controle-usuario/list" exact="exact" component={UsersList}/>
                <Route path="/controle-usuario/create" exact="exact" component={UsersInsert}/>
                <Route path="/controle-usuario/update/:id" exact="exact" component={UsersUpdate}/>
            </Switch>
        </Router>
    )
}

export default App;