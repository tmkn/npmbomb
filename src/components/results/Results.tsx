/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import { Redirect } from "react-router-dom";

import { ResultsTable, Number } from "../shared/results/Results";

interface IResult {
    pkg: string;
    dependencies: number;
    guess: number;
}

type Results = IResult[];

interface IResultsProps {
    results: Results;
}

const Results: React.FC<IResultsProps> = ({ results }) => {
    if (results.length === 0) return <Redirect to="/" />;

    const alignRight = css({
        textAlign: "right"
    });

    return (
        <React.Fragment>
            <h1>Results</h1>
            <ResultsTable columns={3}>
                {results.map(({ pkg, dependencies, guess }) => {
                    return (
                        <React.Fragment>
                            <div>{pkg}</div>
                            <div css={alignRight}>
                                <Number>{guess}</Number> dependencies
                            </div>
                            <div css={alignRight}>
                                <Number>{dependencies}</Number> you
                            </div>
                        </React.Fragment>
                    );
                })}
            </ResultsTable>
        </React.Fragment>
    );
};

export default Results;
