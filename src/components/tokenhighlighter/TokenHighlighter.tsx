import React, { memo } from "react";

export type TokenFormatter = (token: string, i: number) => JSX.Element;

interface ITokenHighlighterProps {
    text: string;
    highlight: string;
    formatter: TokenFormatter;
}

export const TokenHighlighter: React.FC<ITokenHighlighterProps> = memo(
    ({ text, highlight, formatter }) => {
        if (highlight === ``) return <React.Fragment>{text}</React.Fragment>;

        const test = new RegExp(`${highlight}`, `gi`);
        let matchResult: RegExpExecArray | null;

        const indexes: Map<number, { isHighlight: boolean }> = new Map([
            [0, { isHighlight: false }],
            [text.length, { isHighlight: false }]
        ]);

        while (null != (matchResult = test.exec(text))) {
            const { index } = matchResult;
            const item = indexes.get(index);

            if (typeof item !== "undefined") {
                item.isHighlight = true;
            } else {
                indexes.set(index, { isHighlight: true });
            }

            indexes.set(index + highlight.length, { isHighlight: false });
        }

        const tokens: JSX.Element[] = [];
        const sortedMatches = [...indexes].sort(([i], [i2]) => i - i2);
        for (const [i, [index, { isHighlight }]] of sortedMatches.entries()) {
            if (i === indexes.size - 1) break;

            const [end] = sortedMatches[i + 1];
            const token = text.substring(index, end);

            const jsx = isHighlight ? (
                formatter(token, i)
            ) : (
                <React.Fragment key={i}>{token}</React.Fragment>
            );
            tokens.push(jsx);
        }

        return <React.Fragment>{tokens}</React.Fragment>;
    }
);
