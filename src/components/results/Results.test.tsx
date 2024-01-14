import React from "react";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import { render, fireEvent } from "@testing-library/react";

import Results from "./Results";
import { AppContext, IAppContext, IGuessResult } from "../../AppContext";

describe("<Results />", () => {
    const guesses: IGuessResult[] = [
        {
            pkgName: "package1",
            actualDependencies: 12,
            guess: 13
        },
        {
            pkgName: "@scoped/package2",
            actualDependencies: 100,
            guess: 101
        }
    ];

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

        for await (const { pkgName, actualDependencies, guess } of guesses) {
            await findByText(new RegExp(pkgName));
            await findByText(new RegExp(actualDependencies.toString()));
            await findByText(new RegExp(guess.toString()));
        }
    });

    test("navigates to home", async () => {
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
            <MemoryRouter initialEntries={["/results"]}>
                <Routes>
                    <Route
                        path={`/results`}
                        element={
                            <AppContext.Provider value={mockedAppContext}>
                                <Results />
                            </AppContext.Provider>
                        }
                    />
                    <Route path={"/"} element={<React.Fragment>Index</React.Fragment>} />
                </Routes>
            </MemoryRouter>
        );

        const homeBtn = await findByText("Home");
        fireEvent.click(homeBtn);
        await findByText("Index");
    });
});
