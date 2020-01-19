/* istanbul ignore file */

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Sentry from "@sentry/browser";

import { App } from "./App";

Sentry.init({ dsn: "https://1a15f3ecc88e462db3c39b14e6708725@sentry.io/1878445" });

function mount(): void {
    const app = document.createElement("div");

    document.body.appendChild(app);

    ReactDOM.render(<App />, app);
}

mount();
