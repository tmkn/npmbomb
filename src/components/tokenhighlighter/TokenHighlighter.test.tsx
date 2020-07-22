import React from "react";
import { render } from "@testing-library/react";

import { TokenHighlighter } from "./TokenHighlighter";

describe("<TokenHighlighter />", () => {
    test(`Correctly renders with empty highlight string`, () => {
        const text = `sample text`;
        const { findByDisplayValue } = render(
            <TokenHighlighter text={text} highlight={``} formatter={token => <>{token}</>} />
        );

        findByDisplayValue(text);
    });

    test(`Correctly renders with no matching highlights`, () => {
        const text = `sample text`;
        const { findByDisplayValue } = render(
            <TokenHighlighter text={text} highlight={`abc`} formatter={token => <>{token}</>} />
        );

        findByDisplayValue(text);
    });

    test(`Correctly renders with matching highlights`, () => {
        const className = "highlight";
        const { container } = render(
            <TokenHighlighter
                text={`hello world hello`}
                highlight={`hello`}
                formatter={(token, i) => (
                    <span key={i} className={className}>
                        {token}
                    </span>
                )}
            />
        );
        const tokens = container.getElementsByClassName(className);

        expect(tokens.length).toBe(2);
    });
});
