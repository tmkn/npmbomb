import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, fireEvent, waitForElement } from "@testing-library/react";

import { Heading } from "./Heading";

describe("<Heading />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(<Heading name={"test"} />);

        expect(asFragment()).toMatchSnapshot();
    });
});
