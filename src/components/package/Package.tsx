import * as React from "react";
import { Switch, Route, useRouteMatch, useParams } from "react-router-dom";

function Package() {
    let { topicId } = useParams<{ topicId: string }>();

    return <React.Fragment>selected package {topicId}</React.Fragment>;
}

export default () => {
    let match = useRouteMatch();

    console.dir(match);

    return (
        <Switch>
            <Route path={`${match.path}/:topicId`}>
                <Package />
            </Route>
            <Route path={match.path}>
                <div>packages</div>
            </Route>
        </Switch>
    );
};
