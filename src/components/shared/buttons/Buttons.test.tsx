import React from "react";
import { render, fireEvent, waitForElement } from "@testing-library/react";

import { PrimaryButton } from "./Buttons";

describe("<PrimaryButton />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(<PrimaryButton>Label</PrimaryButton>);

        expect(asFragment()).toMatchSnapshot();
    });
});
