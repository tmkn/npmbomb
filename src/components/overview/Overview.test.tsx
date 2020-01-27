import React from "react";
import { BrowserRouter } from "react-router-dom";

import { render, fireEvent, waitForElement, wait } from "@testing-library/react";

import Overview from "./Overview";

describe("<Overview />", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    test("matches snapshot", async () => {
        const { asFragment } = render(<Overview />);

        expect(asFragment()).toMatchSnapshot();

        await wait();
    });
});
