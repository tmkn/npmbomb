import React from "react";
import { BrowserRouter, MemoryRouter, Route } from "react-router-dom";
import { render, fireEvent, waitForElement, wait } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";

import { Package, IPackageInfo } from "./Package";
import { AppContext, IAppContext } from "../../App";

describe("<Package />", () => {
    const testData: IPackageInfo = {
        name: `typescript`,
        version: `1.2.3`,
        description: `foo`,
        dependencies: 123,
        directDependencies: 10,
        distinctDependencies: 50
    };

    const scopedTestData: IPackageInfo = {
        name: `@typescript/foo`,
        version: `1.2.3`,
        description: `foo`,
        dependencies: 123,
        directDependencies: 10,
        distinctDependencies: 50
    };

    beforeEach(() => {
        fetchMock.resetMocks();
    });

    test("renders not found view", async () => {
        const { getByText } = render(
            <MemoryRouter initialEntries={["/typescript@1.2.3"]}>
                <Route exact path={`/:pkgName`}>
                    <Package />
                </Route>
            </MemoryRouter>
        );

        await waitForElement(() => getByText("Whoops, couldn't find data for this package!"));
    });

    test("renders game view", async () => {
        fetchMock.doMockIf("/data/typescript@1.2.3.json", JSON.stringify(testData));

        const mockAppContext: IAppContext = {
            appState: {
                guesses: [],
                inGameMode: true,
                packages: [],
                remaining: ["a", "b"]
            },
            setAppState: () => {}
        };
        const { getByText } = render(
            <MemoryRouter initialEntries={["/typescript@1.2.3"]}>
                <Route exact path={`/:pkgName`}>
                    <AppContext.Provider value={mockAppContext}>
                        <Package />
                    </AppContext.Provider>
                </Route>
            </MemoryRouter>
        );

        await waitForElement(() => getByText("[1/2]"));
    });

    test("does a guess in game view", async () => {
        fetchMock.doMockIf("/data/typescript@1.2.3.json", JSON.stringify(testData));

        const mockAppContext: IAppContext = {
            appState: {
                guesses: [],
                inGameMode: true,
                packages: [],
                remaining: ["a", "b"]
            },
            setAppState: () => {}
        };
        const { container, getByText } = render(
            <MemoryRouter initialEntries={["/typescript@1.2.3"]}>
                <Route exact path={`/:pkgName`}>
                    <AppContext.Provider value={mockAppContext}>
                        <Package />
                    </AppContext.Provider>
                </Route>
            </MemoryRouter>
        );

        await waitForElement(() => getByText("[1/2]"));
        const inputEl = await waitForElement(() => container.querySelector("input"));
        const guessBtn = await waitForElement(() => getByText("Guess"));

        fireEvent.change(inputEl!, { target: { value: "100" } });
        fireEvent.click(guessBtn);

        await waitForElement(() => getByText("23"));
    });

    test("does a guess", async () => {
        fetchMock.doMockIf("/data/typescript@1.2.3.json", JSON.stringify(testData));

        const { container, getByText } = render(
            <MemoryRouter initialEntries={["/typescript@1.2.3"]}>
                <Route exact path={`/:pkgName`}>
                    <Package />
                </Route>
            </MemoryRouter>
        );
        const inputEl = await waitForElement(() => container.querySelector("input"));
        const guessBtn = await waitForElement(() => getByText("Guess"));

        fireEvent.change(inputEl!, { target: { value: "100" } });
        fireEvent.click(guessBtn);

        await waitForElement(() => getByText("23"));
    });

    test("does a correct guess", async () => {
        fetchMock.doMockIf("/data/typescript@1.2.3.json", JSON.stringify(testData));

        const { container, getByText } = render(
            <MemoryRouter initialEntries={["/typescript@1.2.3"]}>
                <Route exact path={`/:pkgName`}>
                    <Package />
                </Route>
            </MemoryRouter>
        );
        const inputEl = await waitForElement(() => container.querySelector("input"));
        const guessBtn = await waitForElement(() => getByText("Guess"));

        fireEvent.change(inputEl!, { target: { value: "123" } });
        fireEvent.click(guessBtn);

        await waitForElement(() => getByText("Congratulations, exact match!"));
    });

    test("does a guess for scoped package", async () => {
        fetchMock.doMockIf("/data/@typescript/foo@1.2.3.json", JSON.stringify(scopedTestData));

        const { container, getByText } = render(
            <MemoryRouter initialEntries={["/@typescript/foo@1.2.3"]}>
                <Route exact path={`/:scope/:pkgName`}>
                    <Package />
                </Route>
            </MemoryRouter>
        );
        const inputEl = await waitForElement(() => container.querySelector("input"));
        const guessBtn = await waitForElement(() => getByText("Guess"));

        fireEvent.change(inputEl!, { target: { value: "100" } });
        fireEvent.click(guessBtn);

        await waitForElement(() => getByText("23"));
    });

    test("does a correct guess for scoped package", async () => {
        fetchMock.doMockIf("/data/@typescript/foo@1.2.3.json", JSON.stringify(scopedTestData));

        const { container, getByText } = render(
            <MemoryRouter initialEntries={["/@typescript/foo@1.2.3"]}>
                <Route exact path={`/:scope/:pkgName`}>
                    <Package />
                </Route>
            </MemoryRouter>
        );
        const inputEl = await waitForElement(() => container.querySelector("input"));
        const guessBtn = await waitForElement(() => getByText("Guess"));

        fireEvent.change(inputEl!, { target: { value: "123" } });
        fireEvent.click(guessBtn);

        await waitForElement(() => getByText("Congratulations, exact match!"));
    });

    test("correctly errors on not available version", async () => {
        fetchMock.doMockIf("/data/lookup.txt", "");

        const { getByText } = render(
            <MemoryRouter initialEntries={["/typescript"]}>
                <Route exact path={`/:pkgName`}>
                    <Package />
                </Route>
            </MemoryRouter>
        );

        await waitForElement(() => getByText("Whoops, couldn't find data for this package!"));
    });

    test("correctly falls back to available version", async () => {
        fetchMock.doMockOnceIf("/data/lookup.txt", "typescript@1.2.3");
        fetchMock.doMockOnceIf("/data/typescript@1.2.3.json", JSON.stringify(testData));

        const { container } = render(
            <MemoryRouter initialEntries={["/typescript"]}>
                <Route exact path={`/:pkgName`}>
                    <Package />
                </Route>
                <Route exact path={`/package/:pkgName`}>
                    <Package />
                </Route>
            </MemoryRouter>
        );

        await waitForElement(() => container.querySelector("input"));
    });
});
