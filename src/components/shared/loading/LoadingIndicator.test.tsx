import React from "react";
import { render, fireEvent } from "@testing-library/react";

import { LoadingIndicator } from "./LoadingIndicator";

describe("<LoadingIndicator />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(<LoadingIndicator />);

        expect(asFragment()).toMatchSnapshot();
    });
});
