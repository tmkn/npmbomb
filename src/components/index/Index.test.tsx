import React from "react";
import { BrowserRouter } from "react-router-dom";

import { render, fireEvent, waitForElement } from "@testing-library/react";

import Index from "./Index";

describe("<Results />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(
            <BrowserRouter>
                <Index />
            </BrowserRouter>
        );

        expect(asFragment()).toMatchSnapshot();
    });
});
