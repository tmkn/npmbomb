/* istanbul ignore file */

import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./App";

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
