import React from "react";
import { render, fireEvent, waitForElement, wait } from "@testing-library/react";

import { PrimaryButton } from "./Buttons";

describe("<PrimaryButton />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(<PrimaryButton>Label</PrimaryButton>);

        expect(asFragment()).toMatchSnapshot();
    });

    test("matches disabled snapshot", () => {
        const { asFragment } = render(<PrimaryButton disabled>Label</PrimaryButton>);

        expect(asFragment()).toMatchSnapshot();
    });

    test("executes callback", async () => {
        const callback = jest.fn();
        const { getByText } = render(<PrimaryButton onClick={callback}>Label</PrimaryButton>);

        fireEvent(
            getByText("Label"),
            new MouseEvent("click", {
                bubbles: true,
                cancelable: true
            })
        );

        expect(callback).toHaveBeenCalled();
    });

    test("doesn't executes callback", async () => {
        const callback = jest.fn();
        const { getByText } = render(
            <PrimaryButton disabled onClick={callback}>
                Label
            </PrimaryButton>
        );

        fireEvent(
            getByText("Label"),
            new MouseEvent("click", {
                bubbles: true,
                cancelable: true
            })
        );

        expect(callback).not.toHaveBeenCalled();
    });
});
