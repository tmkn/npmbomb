/** @jsx jsx */
import { jsx, css, keyframes } from "@emotion/core";
import React, { useContext, useEffect } from "react";
import { Redirect, Link, useHistory } from "react-router-dom";

import { ResultsTable, Num } from "../shared/results/Results";
import { primaryColor, mq, mobileOnly, hideOnMobile } from "../../css";
import { Center } from "../shared/center/Center";
import { PrimaryButton } from "../shared/buttons/Buttons";
import { Divider } from "../shared/divider/Divider";
import { IGuessResult, AppContext } from "../../App";
import { setDefaultTitle } from "../../title";

type Results = IGuessResult[];

const Results: React.FC = () => {
    const { appState, setAppState } = useContext(AppContext);
    const history = useHistory();

    useEffect(() => {
        setDefaultTitle();
    });

    if (appState.guesses.length === 0) return <Redirect to="/" />;

    const alignRight = css({
        [mq[0]]: {
            textAlign: "right",
            alignSelf: "center"
        }
    });

    const primary = css({
        [mq[0]]: {
            color: primaryColor
        }
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

    function onHome() {
        setAppState({
            ...appState,
            inGameMode: false,
            guesses: [],
            remaining: []
        });

        history.push("/");
    }

    return (
        <React.Fragment>
            <h1>Results</h1>
            <ResultsTable columns={3}>
                <div css={mobileOnly}></div>
                <div css={[mobileOnly, alignRight]}>Deps.</div>
                <div css={[mobileOnly, alignRight]}>You</div>
                {appState.guesses.map(({ pkg, dependencies, guess }, i) => {
                    const animation = css({
                        [mq[0]]: {
                            opacity: 0,
                            animation: `${fadeIn} 1s ease forwards, ${moveIn} 500ms ease forwards`,
                            animationDelay: `${500 * i}ms`
                        }
                    });

                    return (
                        <React.Fragment key={pkg}>
                            <div css={[animation, primary]}>{pkg}</div>
                            <div css={[alignRight, animation]}>
                                <span>
                                    <Num>{dependencies}</Num>{" "}
                                    <span css={hideOnMobile}>Dependencies</span>
                                </span>
                            </div>
                            <div css={[alignRight, animation]}>
                                <span>
                                    <Num>{guess}</Num> <span css={hideOnMobile}>You</span>
                                </span>
                            </div>
                        </React.Fragment>
                    );
                })}
            </ResultsTable>
            <Divider margin={"1rem 0"} />
            <Center>
                <PrimaryButton onClick={onHome}>Home</PrimaryButton>
            </Center>
        </React.Fragment>
    );
};

export default Results;
