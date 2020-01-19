import React from "react";
import { render, fireEvent, waitForElement } from "@testing-library/react";

import { TextLink, ClickLink } from "./TextLink";

describe("<TextLink />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(<TextLink href="abc">Hello World</TextLink>);

        expect(asFragment()).toMatchSnapshot();
    });

    test("render basic link", async () => {
        const { findAllByText, getByText } = render(<TextLink href="abc">Hello World</TextLink>);

        expect(getByText("Hello World")).toBeDefined();
    });
});

describe("<ClickLink />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(<ClickLink onClick={() => {}}>Hello World</ClickLink>);

        expect(asFragment()).toMatchSnapshot();
    });
});
