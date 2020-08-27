import React from "react";
import { render, fireEvent, waitForElement } from "@testing-library/react";

import { ResultsTable, Num } from "./ResultsTable";

describe("<ResultsTable />", () => {
    test("matches snapshot", () => {
        const { asFragment } = render(
            <ResultsTable columns={2}>
                <div>1</div>
                <div>
                    <Num>2</Num>
                </div>
                <div>3</div>
                <div>4</div>
            </ResultsTable>
        );

        expect(asFragment()).toMatchSnapshot();
    });
});
