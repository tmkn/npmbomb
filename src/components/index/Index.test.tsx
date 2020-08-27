import React from "react";
import { BrowserRouter } from "react-router-dom";

import { render, fireEvent, waitFor } from "@testing-library/react";

import Index from "./Index";

describe("<Index />", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    test("matches snapshot", async () => {
        fetchMock.mockResponseOnce(JSON.stringify(["sd", "l", "h", "m"]));
        const { asFragment } = render(
            <BrowserRouter>
                <Index />
            </BrowserRouter>
        );

        expect(asFragment()).toMatchSnapshot();

        await waitFor(() => expect(asFragment()).toMatchSnapshot());
    });
});
