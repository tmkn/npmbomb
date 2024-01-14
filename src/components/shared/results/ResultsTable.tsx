/** @jsx jsx */
import { jsx, css } from "@emotion/react";

import { serifFont, textColor, mq } from "../../../css";
import { PropsWithChildren } from "react";

const numberStyle = css({
    [mq[0]]: {
        color: `${textColor}`,
        fontFamily: `"${serifFont}"`
    }
});

export const Num: React.FC<PropsWithChildren> = ({ children }) => (
    <span css={numberStyle}>{children}</span>
);

interface IResultsTableProps {
    columns: number;
}

export const ResultsTable: React.FC<PropsWithChildren<IResultsTableProps>> = ({
    children,
    columns
}) => {
    const resultsTable = css({
        [mq[0]]: {
            display: "grid",
            gridTemplateColumns: `${new Array(columns)
                .fill("")
                .map(n => "1fr")
                .join(" ")}`,
            columnGap: "1rem",
            rowGap: "1rem",
            color: `${textColor}`
        }
    });

    return <div css={resultsTable}>{children}</div>;
};
