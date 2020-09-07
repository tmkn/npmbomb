import React from "react";

import { render, fireEvent, waitFor } from "@testing-library/react";

import Overview from "./Overview";
import { AppContext, IAppContext } from "../../AppContext";

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
        const { asFragment, findByPlaceholderText } = render(
            <AppContext.Provider value={mockedAppContext}>
                <Overview />
            </AppContext.Provider>
        );

        expect(asFragment()).toMatchSnapshot();

        await findByPlaceholderText(`Search packages`);
    });

    test("correctly displays packages", async () => {
        const { findByText, container } = render(
            <AppContext.Provider value={mockedAppContext}>
                <Overview />
            </AppContext.Provider>
        );

        for (const name of packageNames) {
            const element = (await findByText(name)) as HTMLAnchorElement;

            expect(element.tagName).toBe("A");
        }

        expect(container.getElementsByTagName("a").length).toEqual(packageNames.length);
    });

    test("correctly displays packages after search", async () => {
        const { findByText, findByPlaceholderText, container } = render(
            <AppContext.Provider value={mockedAppContext}>
                <Overview />
            </AppContext.Provider>
        );
        const inputEl = await findByPlaceholderText(`Search packages`);

        fireEvent.change(inputEl!, { target: { value: "test" } });

        await findByText(/Found 3 packages/), { timeout: 1000 };

        const filtered = await waitFor(() => container.getElementsByTagName("a"));

        expect(filtered.length).toEqual(3);
    });

    test("correctly displays empty search results", async () => {
        const { findByText, findByPlaceholderText, container } = render(
            <AppContext.Provider value={mockedAppContext}>
                <Overview />
            </AppContext.Provider>
        );

        const inputEl = await findByPlaceholderText(`Search packages`);

        fireEvent.change(inputEl!, { target: { value: "adfasfsdf" } });

        await findByText(/No packages found/);

        const filtered = await waitFor(() => container.getElementsByTagName("a"));

        expect(filtered.length).toEqual(0);
    });

    test("correctly displays loading error", async () => {
        fetchMock.mockReject();

        const { findByText, container } = render(
            <AppContext.Provider value={mockedAppContext}>
                <Overview />
            </AppContext.Provider>
        );

        await findByText(/Couldn't load info/);
    });
});
