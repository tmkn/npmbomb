import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, fireEvent, waitForElement } from "@testing-library/react";

import { ResultBox } from "./ResultBox";

describe("<ResultBox />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(<ResultBox guess={23} actual={45} distinct={123} />);

        expect(asFragment()).toMatchSnapshot();
    });
});
