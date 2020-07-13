import React from "react";
import {Route, Switch} from 'react-router-dom'

import {
    UsersList,
    UsersInsert,
    UsersUpdate,
    Dashboard,
    Desempenho,
    Classroom,
    Login
} from '../pages'

export default function Routes() {

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
            <Route
                exact={true}
                from="/login"
                render={props => <Login {...props}/>
                }
            />
        </Switch>
    );
}