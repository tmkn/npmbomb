import React from "react";
import { render, fireEvent, waitForElement } from "@testing-library/react";

import { GuessBox, IGuessContext, GuessContext } from "./GuessBox";

describe("<GuessBox />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(<GuessBox />);

        expect(asFragment()).toMatchSnapshot();
    });

    test("do valid input", async () => {
        const guess = "1337";
        const { container } = render(<GuessBox />);
        const input = await waitForElement(() =>
            container.querySelector<HTMLInputElement>("input[type='text']")
        );

        fireEvent.change(input!, { target: { value: guess } });

        expect(input!.value).toBe(guess);
    });

    test("do invalid input", async () => {
        const { container } = render(<GuessBox />);
        const input = await waitForElement(() =>
            container.querySelector<HTMLInputElement>("input[type='text']")
        );

        fireEvent.change(input!, { target: { value: "abc" } });

        expect(input!.value).toBe("");
    });

    test("executes guess callback", async () => {
        const callback = jest.fn();
        const mockContext: IGuessContext = {
            guess: undefined,
            package: null!,
            setUserGuess: callback
        };
        const { container, getByText } = render(
            <GuessContext.Provider value={mockContext}>
                <GuessBox />
            </GuessContext.Provider>
        );
        const input = await waitForElement(() =>
            container.querySelector<HTMLInputElement>("input[type='text']")
        );
        const btn = await waitForElement(() => getByText("Guess"));

        fireEvent.change(input!, { target: { value: "1337" } });
        fireEvent.click(btn);

        expect(callback).toHaveBeenCalled();
    });
});
