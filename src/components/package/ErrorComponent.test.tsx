import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, fireEvent, waitForElement } from "@testing-library/react";

import { ErrorComponent, NotFound } from "./ErrorComponent";

describe("<ErrorComponent />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(
            <BrowserRouter>
                <ErrorComponent pkgName={"test"} />
            </BrowserRouter>
        );

        expect(asFragment()).toMatchSnapshot();
    });
});

describe("<NotFound />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(
            <BrowserRouter>
                <NotFound pkgName={"test"} />
            </BrowserRouter>
        );

        expect(asFragment()).toMatchSnapshot();
    });
});
