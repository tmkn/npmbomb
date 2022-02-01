import React from "react";
import { render, fireEvent } from "@testing-library/react";

import { Center } from "./Center";

describe("<Center />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(<Center>Test</Center>);

        expect(asFragment()).toMatchSnapshot();
    });
});
