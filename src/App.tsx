import * as React from "react";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";

import Index from "./components/index/Index";
import Package from "./components/package/Package";

export const App: React.FC = () => {
    return (
        <BrowserRouter>
            <div>
                <Link to="/">Home</Link> <div></div>
                <Link to="/package/typescript">package</Link>
            </div>
            <Switch>
                <Route path="/package">
                    <Package />
                </Route>
                <Route path="/">
                    <Index />
                </Route>
            </Switch>
        </BrowserRouter>
    );
};
