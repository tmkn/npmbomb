import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, fireEvent, waitForElement } from "@testing-library/react";

import Results from "./Results";

describe("<Results />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(
            <BrowserRouter>
                <Results />
            </BrowserRouter>
        );

        expect(asFragment()).toMatchSnapshot();
    });
});
