/** @jsx jsx */
import { jsx, css, keyframes } from "@emotion/react";
import React, { useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { ResultsTable, Num } from "../shared/results/ResultsTable";
import { primaryColor, mq, mobileOnly, hideOnMobile } from "../../css";
import { Center } from "../shared/center/Center";
import { PrimaryButton } from "../shared/buttons/Buttons";
import { Divider } from "../shared/divider/Divider";
import { setDefaultTitle } from "../../title";
import { AppContext, IGuessResult } from "../../AppContext";

type Results = IGuessResult[];

const Results: React.FC = () => {
    const { appState, setAppState } = useContext(AppContext);
    const history = useNavigate();

    useEffect(() => {
        setDefaultTitle();
    });

    if (appState.guesses.length === 0) return <Navigate to="/" />;

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

        history("/");
    }

    return (
        <React.Fragment>
            <h1>Results</h1>
            <ResultsTable columns={3}>
                <div css={mobileOnly}></div>
                <div css={[mobileOnly, alignRight]}>Deps.</div>
                <div css={[mobileOnly, alignRight]}>You</div>
                {appState.guesses.map(({ pkgName, actualDependencies, guess }, i) => {
                    const animation = css({
                        [mq[0]]: {
                            opacity: 0,
                            animation: `${fadeIn} 1s ease forwards, ${moveIn} 500ms ease forwards`,
                            animationDelay: `${500 * i}ms`
                        }
                    });

                    return (
                        <React.Fragment key={pkgName}>
                            <div css={[animation, primary]}>{pkgName}</div>
                            <div css={[alignRight, animation]}>
                                <span>
                                    <Num>{actualDependencies}</Num>{" "}
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
