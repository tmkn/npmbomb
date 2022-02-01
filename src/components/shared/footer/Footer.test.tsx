import React from "react";
import { render, fireEvent } from "@testing-library/react";

import Footer from "./Footer";

describe("<Footer />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(<Footer />);

        expect(asFragment()).toMatchSnapshot();
    });
});
