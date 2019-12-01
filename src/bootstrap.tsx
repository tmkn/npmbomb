import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import { App } from "./App";

/*const style = css`
  color: blue;
`*/

function mount(): void {
    const app = document.createElement("div");

    document.body.appendChild(app);

    ReactDOM.render(
        <div>
            <App />
        </div>,
        app
    );
}

mount();
