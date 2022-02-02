import React from "react";
import { render, fireEvent } from "@testing-library/react";

import { Info } from "./Info";

describe("<Info />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(<Info>Hello</Info>);

        expect(asFragment()).toMatchSnapshot();
    });
});
