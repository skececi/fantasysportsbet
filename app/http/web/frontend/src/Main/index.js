import React, { Component } from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import { Security, LoginCallback, SecureRoute } from '@okta/okta-react';

import Login from '../Login';
import Home from '../Home';
import CreateABetForm from "../CreateABetForm/CreateABetForm";


// TODO: move to new file
const OKTA_DOMAIN = 'dev-156502.okta.com';
const HOST = window.location.host;
const CALLBACK_PATH = '/implicit/callback';

const ISSUER = `https://${OKTA_DOMAIN}/oauth2/default`;
const CLIENT_ID = '0oadn2cj6aX7yutR54x6';
const REDIRECT_URI = `http://${HOST}${CALLBACK_PATH}`;
const SCOPE = ['openid', 'profile', 'email'];


class Main extends Component {
    render() {
        return (
            <Router>
                <Security
                    issuer={ISSUER}
                    client_id={CLIENT_ID}
                    redirect_uri={REDIRECT_URI}
                    scope={SCOPE}>
                    <Switch>
                        <Route exact path="/" component={Login} />
                        <Route path="/implicit/callback" component={LoginCallback} />
                        <SecureRoute path ="/home" component={Home} />
                        <SecureRoute path ="/create_bet" component={CreateABetForm}/>
                    </Switch>
                </Security>
            </Router>
        );
    }
}


export default Main;