import React from 'react';
import Home from './pages/Home';
import Album from './pages/Album';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Home exact path="/" component={Home} />
                <Route path="/album/:id" >
                    <Album />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}