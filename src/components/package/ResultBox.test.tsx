import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, fireEvent } from "@testing-library/react";

import { ResultBox, SummaryTabs } from "./ResultBox";
import { GuessContext, IGuessContext } from "./GuessBox";

describe("<ResultBox />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(<ResultBox guess={23} actual={45} distinct={123} />);

        expect(asFragment()).toMatchSnapshot();
    });
});

describe("<SummaryTabs />", () => {
    beforeEach(() => {
        //needed by react-virtualized for rendering the list
        jest.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(300);
        jest.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(300);
    });

    const context: IGuessContext = {
        guess: undefined,
        setUserGuess: () => {},
        package: {
            name: `test`,
            version: `123`,
            description: `some description`,
            dependencies: 1337,
            distinctDependencies: 10,
            directDependencies: 15,
            tree: {
                data: [
                    {
                        id: 0,
                        name: `test`,
                        version: `123`,
                        count: 1
                    },
                    {
                        id: 1,
                        name: `dep1`,
                        version: `1`,
                        count: 1
                    },

                    {
                        id: 2,
                        name: `dep2`,
                        version: `1`,
                        count: 1
                    },
                    {
                        id: 3,
                        name: `dep3`,
                        version: `1`,
                        count: 1
                    }
                ],
                tree: {
                    id: 0,
                    dependencies: [{ id: 1 }, { id: 2, dependencies: [{ id: 3 }] }]
                }
            }
        }
    };

    test("Correctly displays dependency tree", async () => {
        const { container, findByText } = render(
            <GuessContext.Provider value={context}>
                <SummaryTabs />
            </GuessContext.Provider>
        );

        const treeTabHeader = await findByText(/Dependency Tree/i);
        fireEvent.click(treeTabHeader);

        await findByText(`test@123`);
        await findByText(`dep1@1`);
        await findByText(`dep2@1`);
    });

    test("Correctly displays error message for dependency tree", async () => {
        const context: IGuessContext = {
            guess: undefined,
            setUserGuess: () => {},
            package: {
                name: `test`,
                version: `123`,
                description: `some description`,
                dependencies: 1337,
                distinctDependencies: 10,
                directDependencies: 15,
                // @ts-expect-error
                tree: {}
            }
        };

        const { findByText } = render(
            <GuessContext.Provider value={context}>
                <SummaryTabs />
            </GuessContext.Provider>
        );

        const treeTabHeader = await findByText(/Dependency Tree/i);
        fireEvent.click(treeTabHeader);

        await findByText(`Whoops, cannot display dependency tree`);
    });

    test("Correctly toggles expand/collapse", async () => {
        const { findByText, findByTestId } = render(
            <GuessContext.Provider value={context}>
                <SummaryTabs />
            </GuessContext.Provider>
        );

        const treeTabHeader = await findByText(/Dependency Tree/i);
        fireEvent.click(treeTabHeader);

        const toggle = await findByTestId(`test@123`);
        const dependency = await findByText(`dep1@1`);
        fireEvent.click(toggle);

        expect(dependency).not.toBeInTheDocument();

        fireEvent.click(toggle);
        await findByText(`dep1@1`);
    });

    test("Correctly expands whole tree", async () => {
        const { findByText, findByTestId } = render(
            <GuessContext.Provider value={context}>
                <SummaryTabs />
            </GuessContext.Provider>
        );

        const treeTabHeader = await findByText(/Dependency Tree/i);
        fireEvent.click(treeTabHeader);

        let toggle = await findByTestId(`dep2@1`);
        fireEvent.click(toggle);

        await findByText(`dep3@1`);
    });
});
