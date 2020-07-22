import React from "react";

import { render, fireEvent, waitForElement, wait } from "@testing-library/react";

import Overview from "./Overview";
import { AppContext, IAppContext } from "../../App";

describe("<Overview />", () => {
    const packageNames = ["test", "foo-test", "@foo/test", "@blabla/foo"];
    const mockedAppContext: IAppContext = {
        appState: {
            guesses: [],
            inGameMode: false,
            remaining: [],
            packages: packageNames
        },
        setAppState: () => {}
    };

    beforeEach(() => {
        fetchMock.resetMocks();

        //needed by react-virtualized for rendering the list
        jest.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(300);
        jest.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(300);
    });

    test("matches snapshot", async () => {
        const { asFragment } = render(
            <AppContext.Provider value={mockedAppContext}>
                <Overview />
            </AppContext.Provider>
        );

        expect(asFragment()).toMatchSnapshot();

        await wait();
    });

    test("correctly displays packages", async () => {
        const { getByText, container } = render(
            <AppContext.Provider value={mockedAppContext}>
                <Overview />
            </AppContext.Provider>
        );

        for (const name of packageNames) {
            const element = (await waitForElement(() => getByText(name))) as HTMLAnchorElement;

            expect(element.tagName).toBe("A");
        }

        expect(container.getElementsByTagName("a").length).toEqual(packageNames.length);
    });

    test("correctly displays packages after search", async () => {
        const { getByText, container } = render(
            <AppContext.Provider value={mockedAppContext}>
                <Overview />
            </AppContext.Provider>
        );
        await wait();

        const inputEl = await waitForElement(() => container.querySelector("input[type='text']"));

        fireEvent.change(inputEl!, { target: { value: "test" } });

        await waitForElement(() => getByText(/Found 3 packages/), { timeout: 1000 });

        const filtered = await waitForElement(() => container.getElementsByTagName("a"));

        expect(filtered.length).toEqual(3);
    });

    test("correctly displays empty search results", async () => {
        const { getByText, container } = render(
            <AppContext.Provider value={mockedAppContext}>
                <Overview />
            </AppContext.Provider>
        );
        await wait();

        const inputEl = await waitForElement(() => container.querySelector("input[type='text']"));

        fireEvent.change(inputEl!, { target: { value: "adfasfsdf" } });

        await waitForElement(() => getByText(/No packages found/));

        const filtered = await waitForElement(() => container.getElementsByTagName("a"));

        expect(filtered.length).toEqual(0);
    });

    test("correctly displays loading error", async () => {
        fetchMock.mockReject();

        const { getByText, container } = render(
            <AppContext.Provider value={mockedAppContext}>
                <Overview />
            </AppContext.Provider>
        );

        await waitForElement(() => getByText(/Couldn't load info/));
    });
});
