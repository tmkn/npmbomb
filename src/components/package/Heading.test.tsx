import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, fireEvent, waitForElement } from "@testing-library/react";

import { PackageHeading } from "./Heading";

describe("<Heading />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(<PackageHeading packageName={"test"} scope={undefined} />);

        expect(asFragment()).toMatchSnapshot();
    });
});
