import React from "react";
import { render, fireEvent, waitForElement, wait } from "@testing-library/react";

import { CountUp } from "./CountUp";

describe("<GuessBox />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(<CountUp target={12} userGuess={54} />);

        expect(asFragment()).toMatchSnapshot();
    });

    test("matches exact match snapshot", async () => {
        const { getByText } = render(<CountUp target={32} userGuess={32} />);

        await waitForElement(() => getByText("32"));
        await wait();
    });
});
