/** @jsx jsx */
import { jsx, css } from "@emotion/core";

import { serifFont, textColor, mq } from "../../../css";

const numberStyle = css({
    [mq[0]]: {
        color: `${textColor}`,
        fontFamily: `"${serifFont}"`
    }
});

export const Num: React.FC = ({ children }) => <span css={numberStyle}>{children}</span>;

interface IResultsTableProps {
    columns: number;
}

export const ResultsTable: React.FC<IResultsTableProps> = ({ children, columns }) => {
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
