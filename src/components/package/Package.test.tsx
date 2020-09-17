import React from "react";
import { MemoryRouter, Route } from "react-router-dom";
import { render, fireEvent, waitFor } from "@testing-library/react";
import fetchMock, { FetchMock } from "jest-fetch-mock";

import { Package } from "./Package";
import { IPackageInfo } from "./PackageData";
import { AppContext, IAppContext } from "../../AppContext";

describe("<Package />", () => {
    const lookupData: string = [
        "testpackage1@1.0.0",
        "testpackage2@1.0.0",
        "testpackage3@1.0.0",
        "testpackage4@1.0.0"
    ].join("\n");

    const testData: IPackageInfo = {
        name: `typescript`,
        version: `1.2.3`,
        description: `foo`,
        dependencies: 123,
        directDependencies: 10,
        distinctDependencies: 50,
        tree: {
            data: [],
            tree: { id: 0 }
        }
    };

    const scopedTestData: IPackageInfo = {
        name: `@typescript/foo`,
        version: `1.2.3`,
        description: `foo`,
        dependencies: 123,
        directDependencies: 10,
        distinctDependencies: 50,
        tree: {
            data: [],
            tree: { id: 0 }
        }
    };

    const testPackage1: IPackageInfo = {
        name: `testpackage1`,
        version: `1.0.0`,
        description: `foo`,
        dependencies: 1,
        directDependencies: 0,
        distinctDependencies: 0,
        tree: {
            data: [],
            tree: { id: 0 }
        }
    };

    const testPackage2: IPackageInfo = {
        name: `testpackage2`,
        version: `1.0.0`,
        description: `foo`,
        dependencies: 2,
        directDependencies: 0,
        distinctDependencies: 0,
        tree: {
            data: [],
            tree: { id: 0 }
        }
    };

    const testPackage3: IPackageInfo = {
        name: `testpackage3`,
        version: `1.0.0`,
        description: `foo`,
        dependencies: 3,
        directDependencies: 0,
        distinctDependencies: 0,
        tree: {
            data: [],
            tree: { id: 0 }
        }
    };

    const testPackage4: IPackageInfo = {
        name: `testpackage4`,
        version: `1.0.0`,
        description: `foo`,
        dependencies: 4,
        directDependencies: 0,
        distinctDependencies: 0,
        tree: {
            data: [],
            tree: { id: 0 }
        }
    };

    function mockResponseNonScoped(fetchMock: FetchMock): void {
        fetchMock.mockResponse(async request => {
            switch (request.url) {
                case "/data/lookup.txt":
                    return lookupData;
                case "/data/testpackage1@1.0.0.json":
                    return JSON.stringify(testPackage1);
                case "/data/testpackage2@1.0.0.json":
                    return JSON.stringify(testPackage2);
                case "/data/testpackage3@1.0.0.json":
                    return JSON.stringify(testPackage3);
                case "/data/testpackage4@1.0.0.json":
                    return JSON.stringify(testPackage4);
                case "/data/typescript@1.2.3.json":
                    return JSON.stringify(testData);
                default:
                    return Promise.reject(`Unmocked route "${request.url}"`);
            }
        });
    }

    function mockResponseScoped(fetchMock: FetchMock): void {
        fetchMock.mockResponse(async request => {
            switch (request.url) {
                case "/data/lookup.txt":
                    return lookupData;
                case "/data/testpackage1@1.0.0.json":
                    return JSON.stringify(testPackage1);
                case "/data/testpackage2@1.0.0.json":
                    return JSON.stringify(testPackage2);
                case "/data/testpackage3@1.0.0.json":
                    return JSON.stringify(testPackage3);
                case "/data/testpackage4@1.0.0.json":
                    return JSON.stringify(testPackage4);
                case "/data/@typescript/foo@1.2.3.json":
                    return JSON.stringify(scopedTestData);
                default:
                    return Promise.reject(`Unmocked route "${request.url}"`);
            }
        });
    }

    beforeEach(() => {
        fetchMock.resetMocks();
    });

    test("renders not found view", async () => {
        const { findByText } = render(
            <MemoryRouter initialEntries={["/typescript@1.2.3"]}>
                <Route exact path={`/:pkgName`}>
                    <Package />
                </Route>
            </MemoryRouter>
        );

        await findByText("Whoops, couldn't find data for this package!");
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
        const { findByText } = render(
            <MemoryRouter initialEntries={["/typescript@1.2.3"]}>
                <Route exact path={`/:pkgName`}>
                    <AppContext.Provider value={mockAppContext}>
                        <Package />
                    </AppContext.Provider>
                </Route>
            </MemoryRouter>
        );

        await findByText("[1/2]");
    });

    test("does a guess in game view", async () => {
        mockResponseNonScoped(fetchMock);

        const mockAppContext: IAppContext = {
            appState: {
                guesses: [],
                inGameMode: true,
                packages: [],
                remaining: ["a", "b"]
            },
            setAppState: () => {}
        };
        const { container, findByText } = render(
            <MemoryRouter initialEntries={["/typescript@1.2.3"]}>
                <Route exact path={`/:pkgName`}>
                    <AppContext.Provider value={mockAppContext}>
                        <Package />
                    </AppContext.Provider>
                </Route>
            </MemoryRouter>
        );

        await findByText("[1/2]");
        const radioEl = [...document.querySelectorAll<HTMLInputElement>("input[type=radio]")].find(
            el => el.value !== "123"
        );
        const guessBtn = await findByText("Guess");

        fireEvent.click(radioEl!);
        fireEvent.click(guessBtn);

        await findByText("Your Guess:");
    });

    test("does a guess", async () => {
        mockResponseNonScoped(fetchMock);

        const { container, findByText } = render(
            <MemoryRouter initialEntries={["/typescript@1.2.3"]}>
                <Route exact path={`/:pkgName`}>
                    <Package />
                </Route>
            </MemoryRouter>
        );
        const guessBtn = await findByText("Guess");
        const radioEl = [...document.querySelectorAll<HTMLInputElement>("input[type=radio]")].find(
            el => el.value !== "123"
        );

        fireEvent.click(radioEl!);
        fireEvent.click(guessBtn);

        await findByText("Your Guess:");
    });

    test("does a correct guess", async () => {
        mockResponseNonScoped(fetchMock);

        const { container, findByText } = render(
            <MemoryRouter initialEntries={["/typescript@1.2.3"]}>
                <Route exact path={`/:pkgName`}>
                    <Package />
                </Route>
            </MemoryRouter>
        );
        const guessBtn = await findByText("Guess");
        const radioEl = [...document.querySelectorAll<HTMLInputElement>("input[type=radio]")].find(
            el => el.value === "123"
        );

        fireEvent.click(radioEl!);
        fireEvent.click(guessBtn);

        await findByText("Congratulations, exact match!");
    });

    test("does a guess for scoped package", async () => {
        mockResponseScoped(fetchMock);

        const { container, findByText } = render(
            <MemoryRouter initialEntries={["/@typescript/foo@1.2.3"]}>
                <Route exact path={`/:scope/:pkgName`}>
                    <Package />
                </Route>
            </MemoryRouter>
        );
        const guessBtn = await findByText("Guess");
        const radioEl = [...document.querySelectorAll<HTMLInputElement>("input[type=radio]")].find(
            el => el.value !== "123"
        );

        fireEvent.click(radioEl!);
        fireEvent.click(guessBtn);

        await findByText("Your Guess:");
    });

    test("does a correct guess for scoped package", async () => {
        mockResponseScoped(fetchMock);

        const { container, findByText } = render(
            <MemoryRouter initialEntries={["/@typescript/foo@1.2.3"]}>
                <Route exact path={`/:scope/:pkgName`}>
                    <Package />
                </Route>
            </MemoryRouter>
        );
        const guessBtn = await findByText("Guess");
        const radioEl = [...document.querySelectorAll<HTMLInputElement>("input[type=radio]")].find(
            el => el.value === "123"
        );

        fireEvent.click(radioEl!);
        fireEvent.click(guessBtn);

        await findByText("Congratulations, exact match!");
    });

    test("correctly errors on not available version", async () => {
        fetchMock.doMockIf("/data/lookup.txt", "");

        const { findByText } = render(
            <MemoryRouter initialEntries={["/typescript"]}>
                <Route exact path={`/:pkgName`}>
                    <Package />
                </Route>
            </MemoryRouter>
        );

        await findByText("Whoops, couldn't find data for this package!");
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

        const el = waitFor(() => container.querySelector("input"));
        expect(el).toBeTruthy();
    });
});
