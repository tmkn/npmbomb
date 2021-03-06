/** @jsx jsx */
import { jsx, css, keyframes } from "@emotion/core";
import React, { useContext, useEffect, useState } from "react";

import {
    mq,
    textColor,
    secondaryColorLight,
    primaryColorDark,
    secondaryColor,
    monospaceFont,
    serifFont
} from "../../css";
import { ResultsTable, Num } from "../shared/results/ResultsTable";
import { Divider } from "../shared/divider/Divider";
import { scaleDuration } from "./CountUp";
import { Info } from "../shared/info/Info";
import { GuessContext } from "./guess/GuessContext";
import { TextLink } from "../shared/link/TextLink";
import { TabView, ITab } from "../shared/tabview/TabView";
import { DependencyTreeTab } from "./DependencyTree";

function plural(count: number): string {
    return count === 1 ? "dependency" : "dependencies";
}

export const SummaryTabs: React.FC = () => {
    const tabs: ITab[] = [
        { header: `Summary`, content: <DependencyOverviewTab /> },
        {
            header: `Dependency Tree`,
            content: <DependencyTreeTab />
        }
    ];

    return <TabView tabs={tabs} />;
};

const DependencyOverviewTab: React.FC = () => {
    const { package: pkg } = useContext(GuessContext);

    return (
        <Info>
            <span>
                <TextLink href={`https://www.npmjs.com/package/${pkg.name}/v/${pkg.version}`}>
                    {pkg.name}@{pkg.version}
                </TextLink>{" "}
                defines{" "}
                <b>
                    {pkg.directDependencies} direct {plural(pkg.directDependencies)}
                </b>{" "}
                which explode into{" "}
                <b>
                    {pkg.dependencies} {plural(pkg.dependencies)} overall
                </b>
                , resulting in{" "}
                <b>
                    {pkg.distinctDependencies} distinct {plural(pkg.distinctDependencies)}
                </b>
                .
            </span>
        </Info>
    );
};

interface IResultBoxProps {
    guess: number;
    actual: number;
    distinct: number;
}

export const ResultBox: React.FC<IResultBoxProps> = ({ guess, actual, distinct }) => {
    const fadeIn = keyframes`
        from {
            height: 0;
            opacity: 0;
        }

        to {
            height: auto;
            opacity: 1;
        }
    `;

    const containerStyle = css({
        [mq[0]]: {
            //display: "none",
            opacity: 0,
            height: 0,
            animation: `${fadeIn} 500ms ease forwards`,
            animationDelay: `${scaleDuration}ms`,
            h2: {
                marginTop: 0
            }
        }
    });

    const resultStyle = css({
        [mq[0]]: {
            marginBottom: "1rem",
            color: textColor
        }
    });

    const distance = Math.abs(guess - actual);

    return (
        <div css={containerStyle}>
            {actual > 0 && <SummaryTabs />}
            {guess !== actual && (
                <React.Fragment>
                    <h2>Results</h2>
                    <Divider margin={"1rem 0"} />
                    <ResultsTable columns={2}>
                        <div>Your Guess:</div>
                        <Num>{guess}</Num>
                        <div>Actual:</div>
                        <Num>{actual}</Num>
                    </ResultsTable>
                    <Divider margin={"1rem 0"} />
                    <div css={resultStyle}>
                        <React.Fragment>
                            You were off by <Num>{distance}</Num>
                        </React.Fragment>
                    </div>
                </React.Fragment>
            )}
        </div>
    );
};
