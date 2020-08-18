import React from "react";
import { render } from "@testing-library/react";

import { CountUp } from "./CountUp";

describe("<GuessBox />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(<CountUp target={12} userGuess={54} />);

        expect(asFragment()).toMatchSnapshot();
    });

    test("matches exact match snapshot", async () => {
        const { getByText, findByText } = render(<CountUp target={32} userGuess={32} />);

        await findByText("32", undefined, { timeout: 6000 });
    }, 6000);
});
