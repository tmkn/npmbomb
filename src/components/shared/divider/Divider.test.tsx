import React from "react";
import { render, fireEvent } from "@testing-library/react";

import { Divider } from "./Divider";

describe("<Divider />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(<Divider margin={"1rem"} />);

        expect(asFragment()).toMatchSnapshot();
    });
});
