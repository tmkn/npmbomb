import React, { useContext, useState, useEffect, useRef, memo } from "react";

interface ITokenHighlighterProps {
    text: string;
    highlight: string;
    formatter: (token: string, i: number) => JSX.Element;
}

export const TokenHighlighter: React.FC<ITokenHighlighterProps> = memo(
    ({ text, highlight, formatter }) => {
        if (highlight === ``) return <React.Fragment>{text}</React.Fragment>;

        const test = new RegExp(`${highlight}`, `gi`);
        const matches: Array<{ matchIndex: number; isHighlight: boolean }> = [];
        let matchResult: RegExpExecArray | null;

        while (null != (matchResult = test.exec(text))) {
            const { index } = matchResult;

            matches.push({ matchIndex: index, isHighlight: true });
            matches.push({ matchIndex: index + highlight.length, isHighlight: false });
        }

        if (matches.length === 0) return <React.Fragment>{text}</React.Fragment>;

        const tokens: JSX.Element[] = matches.map(({ matchIndex, isHighlight }, i) => {
            let token: string;

            if (i === 0 && matchIndex !== 0) {
                token = text.substring(0, matchIndex);
            }
            else if (i === matches.length - 1) {
                token = text.substring(matchIndex);
            } else {
                token = text.substring(matchIndex, matches[i + 1].matchIndex);
            }

            return isHighlight ? (
                formatter(token, i)
            ) : (
                <React.Fragment key={i}>{token}</React.Fragment>
            );
        });

        return <React.Fragment>{tokens}</React.Fragment>;
    }
);
