/** @jsx jsx */
import { jsx, css } from "@emotion/core";

const numberStyle = css({
    color: "#616161",
    fontFamily: "Roboto Slab"
});

export const Number: React.FC = ({ children }) => <span css={numberStyle}>{children}</span>;

interface IResultsTableProps {
    columns: number;
}

export const ResultsTable: React.FC<IResultsTableProps> = ({ children, columns }) => {
    const resultsTable = css({
        display: "grid",
        gridTemplateColumns: `${new Array(columns)
            .fill("")
            .map(n => "max-content")
            .join(" ")}`,
        columnGap: "1rem",
        rowGap: "1rem",
        color: "#616161"
    });

    return <div css={resultsTable}>{children}</div>;
};
