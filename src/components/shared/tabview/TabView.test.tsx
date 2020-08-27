import React from "react";
import { render, fireEvent, waitForElement } from "@testing-library/react";

import { TabView, ITab } from "./TabView";

describe("<TabView />", () => {
    test("matches snapshot", () => {
        const tabs: ITab[] = [
            { header: `Tab 1`, content: <div>tab 1 content</div> },
            { header: `Tab 2`, content: <div>tab 2 content</div> }
        ];
        const { asFragment } = render(<TabView tabs={tabs} />);

        expect(asFragment()).toMatchSnapshot();
    });

    test("Changes tab on click", async () => {
        const tabHeader1 = `Tab 1`;
        const tabHeader2 = `Tab 2`;
        const tabContent1 = `tab 1 content`;
        const tabContent2 = `tab 2 content`;
        const tabs: ITab[] = [
            { header: tabHeader1, content: <div>{tabContent1}</div> },
            { header: tabHeader2, content: <div>{tabContent2}</div> }
        ];
        const { container, getByText, findByText, queryByText } = render(<TabView tabs={tabs} />);

        await findByText(tabHeader1);
        const tabHeader2El = await findByText(tabHeader2);
        await findByText(tabContent1);
        expect(queryByText(tabContent2)).not.toBeInTheDocument();

        //click on 2nd tab
        fireEvent.click(tabHeader2El);
        await findByText(tabContent2);
        expect(queryByText(tabContent1)).not.toBeInTheDocument();
    });
});
