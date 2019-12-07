import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, fireEvent, waitForElement } from "@testing-library/react";

import { GuessBox } from "./GuessBox";

describe("<GuessBox />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(<GuessBox />);

        expect(asFragment()).toMatchSnapshot();
    });
});
