import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, fireEvent, waitForElement } from "@testing-library/react";

import { CountUp } from "./CountUp";

describe("<GuessBox />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(<CountUp target={12} userGuess={54} />);

        expect(asFragment()).toMatchSnapshot();
    });
});
