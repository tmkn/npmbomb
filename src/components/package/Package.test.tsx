import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, fireEvent, waitForElement } from "@testing-library/react";

import Package from "./Package";

describe("<Package />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(
            <BrowserRouter>
                <Package />
            </BrowserRouter>
        );

        expect(asFragment()).toMatchSnapshot();
    });
});
