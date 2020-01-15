/** @jsx jsx */
import { jsx, css, keyframes } from "@emotion/core";
import React, { useContext, useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import shuffle from "lodash.shuffle";

import { mq, serifFont, sansSerifFont, primaryColor, secondaryColor, textColor } from "../../css";
import { PrimaryButton } from "../shared/buttons/Buttons";
import { Info } from "../shared/info/Info";
import { Center } from "../shared/center/Center";
import { Divider } from "../shared/divider/Divider";
import { AppContext } from "../../App";
import { TextLink } from "../shared/link/TextLink";

const highlightStyle = css({
    color: `${primaryColor}`
});

const Highlight: React.FC = ({ children }) => <span css={highlightStyle}>{children}</span>;

const faqStyle = css({
    fontFamily: `"${sansSerifFont}"`,
    color: `${textColor}`
});

const arrowStyle = css({
    [mq[0]]: {
        display: "inline-block"
    }
});

const expandAnimation = keyframes`
    0% {
        transform: rotateZ(0deg);
    }

    100% {
        transform: rotateZ(90deg);
    }
`;

const collapseAnimation = keyframes`
    0% {
        transform: rotateZ(90deg);
    }

    100% {
        transform: rotateZ(0deg);
    }
`;

const expandStyle = css({
    [mq[0]]: {
        animation: `${expandAnimation} 500ms ease forwards`
    }
});

const collapseStyle = css({
    [mq[0]]: {
        animation: `${collapseAnimation} 500ms ease forwards`
    }
});

const expandAnimation2 = keyframes`
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
`;

const collapseAnimation2 = keyframes`
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
`;

const contentCollapseStyle = css({
    [mq[0]]: {
        animation: `${collapseAnimation2} 500ms ease forwards`
    }
});

const contentExpandStyle = css({
    [mq[0]]: {
        display: "block",
        animation: `${expandAnimation2} 500ms ease forwards`
    }
});

interface IFaqProps {
    header: string;
    collapsed?: boolean;
}

const Faq: React.FC<IFaqProps> = ({ children, header, collapsed }) => {
    const [expanded, setExpandend] = useState(!collapsed ?? true);
    const contentEl = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!expanded) {
            window.setTimeout(() => {
                if (contentEl.current) {
                    contentEl.current.style.display = "none";
                }
            }, 400);
        } else {
            if (contentEl.current) {
                contentEl.current.style.display = "block";
            }
        }
    }, [expanded]);

    useEffect(() => {
        if (contentEl.current && !expanded) {
            contentEl.current.style.display = "none";
        }
    }, []);

    function onClick() {
        setExpandend(!expanded);
    }

    return (
        <React.Fragment>
            <H2 onClick={onClick}>
                <span style={{ cursor: "pointer" }}>
                    <span css={[arrowStyle, expanded ? expandStyle : collapseStyle]}>></span>{" "}
                    {header}
                </span>
            </H2>
            <div
                ref={contentEl}
                css={[faqStyle, expanded ? contentExpandStyle : contentCollapseStyle]}
            >
                {children}
            </div>
        </React.Fragment>
    );
};

const h2Style = css({
    fontFamily: `"${serifFont}"`,
    color: `${secondaryColor}`,
    fontWeight: 200,
    marginBottom: "0.5rem"
});

interface IH2Props {
    onClick?: (e: React.MouseEvent<HTMLHeadingElement>) => void;
}

const H2: React.FC<IH2Props> = ({ children, onClick }) => {
    const _onClick = onClick ?? (() => {});

    return (
        <h2 css={h2Style} onClick={_onClick}>
            {children}
        </h2>
    );
};

const style = css({
    fontFamily: `"${serifFont}"`,
    display: "flex",
    flexDirection: "column"
});

export default () => {
    const { appState, setAppState } = useContext(AppContext);
    const history = useHistory();

    useEffect(() => {
        fetchAvailablePackages().then(pkgs => {
            setAppState({
                ...appState,
                packages: pkgs
            });
        });
    }, []);

    function onStart() {
        const remaining = shuffle(appState.packages).slice(0, 4);

        setAppState({
            ...appState,
            remaining: remaining,
            inGameMode: true
        });
        history.push(`/package/${remaining[0]}`);
    }

    return (
        <div css={style}>
            <h1>About</h1>
            <Info>
                Test your knowledge of the NPM ecosystem by guessing the number of dependencies for
                popular NPM packages.
            </Info>
            <Center>
                <PrimaryButton onClick={onStart}>Start</PrimaryButton>
            </Center>
            <Divider margin={"2rem 0"} />
            <H2>FAQ</H2>
            <Faq header="How is the dependency count calculated?" collapsed>
                As the dependency tree is traversed, each dependency from the dependencies field in
                the package.json is added to the count. It's a straight accumulation, as such a
                single package is counted multiple times if it is a dependency of other packages.
            </Faq>
            <Faq header="Why is it called npmbomb?" collapsed>
                It's a hommage to zip bomb. According to Wikipedia a zip bomb is:
                <blockquote css={{ fontFamily: `"${serifFont}"` }}>
                    "A zip bomb is usually a small file .... however, when the file is unpacked, its
                    contents are more than the system can handle."
                </blockquote>
                That sure sounds like your typical <Highlight>npm install</Highlight> 😈
            </Faq>
            <Faq header="Does it count dev dependencies?" collapsed>
                No, it only shows (and counts) dependencies from the{" "}
                <Highlight>dependencies</Highlight> entry in the <Highlight>package.json</Highlight>{" "}
                all the way to the very bottom.
            </Faq>
            <Faq header="Why can't I find library XYZ?" collapsed>
                For now, it only shows a preselected number of libraries, namely the ones that are
                in the dependency tree of the most downloaded packages or specifically handpicked
                ones. If you want a specific dependency you can hit me up on Twitter{" "}
                <TextLink href="https://twitter.com/tmkndev">@tmkndev</TextLink>
            </Faq>
            <Faq header="Is it Open Source?" collapsed>
                <TextLink href="https://github.com/tmkn/npmbomb">Yes</TextLink>
            </Faq>
        </div>
    );
};

async function fetchAvailablePackages(): Promise<string[]> {
    const resp = await fetch(`data/lookup.txt`);
    const text = await resp.text();

    return text
        .split("\n")
        .map(l => l.trim())
        .filter(l => l !== "");
}
