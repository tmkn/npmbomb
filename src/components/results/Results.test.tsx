import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, fireEvent } from "@testing-library/react";

import Results from "./Results";
import { AppContext, IAppContext } from "../../App";

describe("<Results />", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    test("matches snapshot", () => {
        const { asFragment } = render(
            <BrowserRouter>
                <Results />
            </BrowserRouter>
        );

        expect(asFragment()).toMatchSnapshot();
    });

    test("lists results", async () => {
        const guesses = [
            {
                pkg: "package1",
                dependencies: 12,
                guess: 13
            },
            {
                pkg: "@scoped/package2",
                dependencies: 100,
                guess: 101
            }
        ];
        const mockedAppContext: IAppContext = {
            appState: {
                guesses: guesses,
                inGameMode: false,
                remaining: [],
                packages: []
            },
            setAppState: () => {}
        };
        const { findByText } = render(
            <BrowserRouter>
                <AppContext.Provider value={mockedAppContext}>
                    <Results />
                </AppContext.Provider>
            </BrowserRouter>
        );

        for await (const { pkg, dependencies, guess } of guesses) {
            await findByText(new RegExp(pkg));
            await findByText(new RegExp(dependencies.toString()));
            await findByText(new RegExp(guess.toString()));
        }
    });
});
