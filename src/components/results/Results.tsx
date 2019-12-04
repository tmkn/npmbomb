/** @jsx jsx */
import { jsx, css, keyframes } from "@emotion/core";
import React from "react";
import { Redirect, Link } from "react-router-dom";

import { ResultsTable, Num } from "../shared/results/Results";
import { primaryColor, mq, mobileOnly, hideOnMobile } from "../../css";
import { Center } from "../shared/center/Center";
import { PrimaryButton } from "../shared/buttons/Buttons";
import { Divider } from "../shared/divider/Divider";

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
        textAlign: "right",
        alignSelf: "center"
    });

    const primary = css({
        color: primaryColor
    });

    const fadeIn = keyframes`
        from, 0%, to {
            opacity: 0
        }

        100% {
            opacity: 1
        }
    `;

    const moveIn = keyframes`
        from, 0%, to {
            transform: translateX(-2rem);
        }

        100% {
            transform: translateX(0px);
        }
    `;

    return (
        <React.Fragment>
            <h1>Results</h1>
            <ResultsTable columns={3}>
                <div css={mobileOnly}></div>
                <div css={[mobileOnly, alignRight]}>Deps.</div>
                <div css={[mobileOnly, alignRight]}>You</div>
                {results.map(({ pkg, dependencies, guess }, i) => {
                    const animation = css({
                        opacity: 0,
                        animation: `${fadeIn} 1s ease forwards, ${moveIn} 500ms ease forwards`,
                        animationDelay: `${500 * (i + 1)}ms`
                    });

                    return (
                        <React.Fragment>
                            <div css={[animation, primary]}>{pkg}</div>
                            <div css={[alignRight, animation]}>
                                <span>
                                    <Num>{guess}</Num> <span css={hideOnMobile}>Dependencies</span>
                                </span>
                            </div>
                            <div css={[alignRight, animation]}>
                                <span>
                                    <Num>{dependencies}</Num> <span css={hideOnMobile}>You</span>
                                </span>
                            </div>
                        </React.Fragment>
                    );
                })}
            </ResultsTable>
            <Divider margin={"1rem 0"} />
            <Center>
                <Link to="/">
                    <PrimaryButton>Home</PrimaryButton>
                </Link>
            </Center>
        </React.Fragment>
    );
};

export default Results;
