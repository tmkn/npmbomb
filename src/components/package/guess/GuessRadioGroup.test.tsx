import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";

import { IGuessContext, GuessContext } from "./GuessContext";
import { GuessRadioGroup } from "./GuessRadioGroup";

describe("<GuessRadioGroup />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(<GuessRadioGroup />);

        expect(asFragment()).toMatchSnapshot();
    });
});
