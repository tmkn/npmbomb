import React from "react";
import { BrowserRouter } from "react-router-dom";

import { render, fireEvent, waitForElement } from "@testing-library/react";

import Index from "./Index";

describe("<Index />", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    test("matches snapshot", () => {
        fetchMock.mockResponseOnce(JSON.stringify(["sd", "l", "h", "m"]));
        const { asFragment } = render(
            <BrowserRouter>
                <Index />
            </BrowserRouter>
        );

        expect(asFragment()).toMatchSnapshot();
    });
});
