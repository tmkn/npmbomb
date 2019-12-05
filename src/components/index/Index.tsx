/** @jsx jsx */
import { jsx, css, keyframes } from "@emotion/core";
import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import shuffle from "lodash.shuffle";

import { mq, serifFont, sansSerifFont, primaryColor, secondaryColor, textColor } from "../../css";
import { PrimaryButton } from "../shared/buttons/Buttons";
import { Info } from "../shared/info/Info";
import { Center } from "../shared/center/Center";
import { Divider } from "../shared/divider/Divider";
import { AppContext } from "../../App";

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
        //animationFillMode: "forwards"
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

const contentCollapseStyle = css({
    [mq[0]]: {
        display: "none"
    }
});

const contentExpandStyle = css({
    [mq[0]]: {
        display: "block"
    }
});

interface IFaqProps {
    header: string;
    collapsed?: boolean;
}

const Faq: React.FC<IFaqProps> = ({ children, header, collapsed }) => {
    const [expanded, setExpandend] = useState(!collapsed ?? true);

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
            <div css={[faqStyle, expanded ? contentExpandStyle : contentCollapseStyle]}>{children}</div>
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

const TextLink: React.FC<{ href: string }> = ({ children, href }) => {
    const style = css({
        [mq[0]]: {
            textDecoration: "underline",
            textDecorationColor: secondaryColor
        }
    });

    return (
        <a css={style} href={href}>
            {children}
        </a>
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

    function onStart() {
        const remaining = shuffle(["typescript", "webpack", "react"]);

        setAppState({
            ...appState,
            remaining: remaining,
            gameMode: true
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
                in the dependency tree of the most downloaded packages.
            </Faq>
            <Faq header="Why doesn't it show a version number?" collapsed>
                Because it's not important, it's just a lighthearted jab at the size of the
                node_modules folder.
            </Faq>
            <Faq header="Is it Open Source?" collapsed>
                <TextLink href="https://github.com/tmkn/npmbomb">Yes</TextLink>
            </Faq>
        </div>
    );
};
