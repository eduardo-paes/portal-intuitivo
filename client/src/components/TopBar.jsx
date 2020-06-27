import React, {Component} from 'react'
import {Link} from 'react-router-dom'

class TopBar extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="top-content">
                    <div className="item-flex">
                        <Link to="/controle-usuario/list">
                            Home
                        </Link>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default TopBar