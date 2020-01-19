import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, fireEvent, waitForElement } from "@testing-library/react";

import { Heading } from "./Heading";

describe("<Heading />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(<Heading packageName={"test"} scope={undefined} />);

        expect(asFragment()).toMatchSnapshot();
    });
});
