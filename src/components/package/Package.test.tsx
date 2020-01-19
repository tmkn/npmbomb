import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, fireEvent, waitForElement } from "@testing-library/react";

import Package from "./Package";

describe("<Package />", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    test("matches snapshot", () => {
        fetchMock.mockResponseOnce(
            JSON.stringify({
                name: `typescript@1.2.3`,
                description: `foo`,
                dependencies: 123
            })
        );

        const { asFragment } = render(
            <BrowserRouter>
                <Package />
            </BrowserRouter>
        );

        expect(asFragment()).toMatchSnapshot();
    });
});
