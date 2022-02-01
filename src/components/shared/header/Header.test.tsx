import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, fireEvent } from "@testing-library/react";

import Header from "./Header";

describe("<Header />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );

        expect(asFragment()).toMatchSnapshot();
    });
});
