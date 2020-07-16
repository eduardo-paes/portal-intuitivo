import React from "react";
import {Route, Switch} from 'react-router-dom'
import StorageProvider from './Store/Provider'
import RoutesPrivate from "./Routes/PrivateRoutes"

// -- Páginas
import {
    UsersList,
    UsersInsert,
    UsersUpdate,
    Dashboard,
    Desempenho,
    Classroom,
    Login,
    HomeScreen
} from '../pages'

function Routes() {
    return (
        <StorageProvider>
            <Switch>
                <Route path="/login" component={Login} />
                <RoutesPrivate path="/" component={HomeScreen} />
            </Switch>
        </StorageProvider>
    );
}

function PrivateRoutes() {
    return (
        <Switch>
            <Route exact={true} from="/" render={props => <Dashboard {...props}/>}/>
            <Route
                exact={true}
                from="/dashboard"
                render={props => <Dashboard {...props}/>
                }
            />
            <Route
                exact={true}
                from="/desempenho"
                render={props => <Desempenho {...props}/>
                }
            />
            <Route
                exact={true}
                from="/classroom"
                render={props => <Classroom {...props}/>
                }
            />
            <Route
                exact={true}
                from="/controle-usuario/"
                render={props => <UsersList {...props}/>
                }
            />
            <Route
                exact={true}
                from="/controle-usuario/list"
                render={props => <UsersList {...props}/>
                }
            />
            <Route
                exact={true}
                from="/controle-usuario/create"
                render={props => <UsersInsert {...props}/>
                }
            />
            <Route
                exact={true}
                from="/controle-usuario/update/:id"
                render={props => <UsersUpdate {...props}/>
                }
            />
        </Switch>
    );
}

export {
    Routes,
    PrivateRoutes
}