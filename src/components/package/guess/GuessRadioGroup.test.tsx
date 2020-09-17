import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";

import { IGuessContext, GuessContext } from "./GuessContext";
import { GuessRadioGroup } from "./GuessRadioGroup";
import { IPackageInfo } from "../PackageData";
import { FetchMock } from "jest-fetch-mock/types";

describe("<GuessRadioGroup />", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    const lookupData: string = [
        "testpackage1@1.0.0",
        "testpackage2@1.0.0",
        "testpackage3@1.0.0",
        "testpackage4@1.0.0"
    ].join("\n");

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

    function mockData(fetchMock: FetchMock): void {
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
                default:
                    return Promise.reject(`Unmocked route "${request.url}"`);
            }
        });
    }

    test("displays options", async () => {
        mockData(fetchMock);

        const context: IGuessContext = {
            package: testPackage1,
            setUserGuess: () => {},
            guess: undefined
        };

        const { findByText } = render(
            <GuessContext.Provider value={context}>
                <GuessRadioGroup />
            </GuessContext.Provider>
        );

        await findByText("Guess");
    });

    test("correctly displays error message", async () => {
        fetchMock.mockResponse(() => Promise.reject(`Intentionally fail`));

        const context: IGuessContext = {
            package: testPackage1,
            setUserGuess: () => {},
            guess: undefined
        };

        const { findByText } = render(
            <GuessContext.Provider value={context}>
                <GuessRadioGroup />
            </GuessContext.Provider>
        );

        await findByText("Something went wrong");
    });

    test("correctly triggers Guess button", async () => {
        mockData(fetchMock);

        const callback = jest.fn();
        const context: IGuessContext = {
            package: testPackage1,
            setUserGuess: callback,
            guess: undefined
        };

        const { findByText } = render(
            <GuessContext.Provider value={context}>
                <GuessRadioGroup />
            </GuessContext.Provider>
        );

        const guessBtn = await findByText("Guess");
        const radioEl = document.querySelector<HTMLInputElement>("input[type=radio]");

        fireEvent.click(radioEl!);
        fireEvent.click(guessBtn);

        expect(callback).toHaveBeenCalled();
    });

    test("submits on enter key", async () => {
        mockData(fetchMock);

        const callback = jest.fn();
        const context: IGuessContext = {
            package: testPackage1,
            setUserGuess: callback,
            guess: undefined
        };

        const { findByText } = render(
            <GuessContext.Provider value={context}>
                <GuessRadioGroup />
            </GuessContext.Provider>
        );

        await findByText("Guess"); //don't delete, need to wait before we can query the radio element
        const radioEl = document.querySelector<HTMLInputElement>("input[type=radio]");

        fireEvent.click(radioEl!);
        fireEvent.keyUp(radioEl!, {
            key: "Enter"
        });

        expect(callback).toHaveBeenCalled();
    });
});
