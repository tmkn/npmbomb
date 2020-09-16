import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";

import { GuessInput } from "./GuessBox";
import { IGuessContext, GuessContext } from "./GuessContext";

describe("<GuessBox />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(<GuessInput />);

        expect(asFragment()).toMatchSnapshot();
    });

    test("do valid input", async () => {
        const guess = "1337";
        const { container } = render(<GuessInput />);
        const input = await waitFor(() =>
            container.querySelector<HTMLInputElement>("input[type='text']")
        );

        fireEvent.change(input!, { target: { value: guess } });

        expect(input!.value).toBe(guess);
    });

    test("do invalid input", async () => {
        const { container } = render(<GuessInput />);
        const input = await waitFor(() =>
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
        const { container, findByText } = render(
            <GuessContext.Provider value={mockContext}>
                <GuessInput />
            </GuessContext.Provider>
        );
        const input = await waitFor(() =>
            container.querySelector<HTMLInputElement>("input[type='text']")
        );
        const btn = await findByText("Guess");

        fireEvent.change(input!, { target: { value: "1337" } });
        fireEvent.click(btn);

        expect(callback).toHaveBeenCalled();
    });

    test("submits on enter key", async () => {
        const callback = jest.fn();
        const mockContext: IGuessContext = {
            guess: undefined,
            package: null!,
            setUserGuess: callback
        };
        const { container } = render(
            <GuessContext.Provider value={mockContext}>
                <GuessInput />
            </GuessContext.Provider>
        );
        const input = await waitFor(() =>
            container.querySelector<HTMLInputElement>("input[type='text']")
        );

        fireEvent.change(input!, { target: { value: "1337" } });
        fireEvent.keyUp(input!, {
            key: "Enter"
        });

        expect(callback).toHaveBeenCalled();
    });
});
