import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, fireEvent, waitForElement } from "@testing-library/react";

import { App } from "./App";

describe("<App />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(<App />);

        expect(asFragment()).toMatchSnapshot();
    });
});
