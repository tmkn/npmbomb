/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import * as React from "react";

import { mq } from "../../css";
import { PrimaryButton } from "../buttons/Buttons";

const highlightStyle = css({
    //fontStyle: "italic",
    color: "#9c27b0"
});

const Highlight: React.FC = ({ children }) => <span css={highlightStyle}>{children}</span>;

const infoStyle = css({
    fontFamily: "Open Sans",
    padding: "2rem",
    backgroundColor: "#e0f7fa",
    color: "#616161",
    margin: 0
});

const Info: React.FC = ({ children }) => {
    return <p css={infoStyle}>{children}</p>;
};

const faqStyle = css({
    fontFamily: "Open Sans",
    color: "#616161"
});

interface IFaqProps {
    header: string;
}

const Faq: React.FC<IFaqProps> = ({ children, header }) => {
    return (
        <React.Fragment>
            <h2>> {header}</h2>
            <div css={faqStyle}>{children}</div>
        </React.Fragment>
    );
};

const style = css({
    fontFamily: "Roboto Slab"
});

export default () => (
    <div css={style}>
        <h1>About</h1>
        <Info>
            Test your knowledge of the NPM ecosystem by guessing the number of dependencies for
            popular NPM packages.
        </Info>
        <PrimaryButton>Start</PrimaryButton>
        <h1>FAQ</h1>
        <Faq header="Why is it called npmbomb?">
            It's a hommage to zip bomb. According to Wikipedia a zip bomb is:
            <blockquote css={{ fontFamily: "Roboto Slab" }}>
                "A zip bomb is usually a small file .... however, when the file is unpacked, its
                contents are more than the system can handle."
            </blockquote>
            That sure sounds like <Highlight>npm install</Highlight>.
        </Faq>
        <Faq header="Does it count dev dependencies?">
            No, it only shows (and counts) dependencies from the <Highlight>dependencies</Highlight>{" "}
            entry in the <Highlight>package.json</Highlight>.
        </Faq>
        <Faq header="Why can't I find library XYZ?">
            For now, it only shows a handful of libraries. The goal is to support all NPM libraries,
            once the site is feature complete.
        </Faq>
        <Faq header="The version number for some libraries are really old">
            The data is calculated from a dump, as such it calculates the data for the latest
            version that was in the dump at the time. But that's fine, the goal is not to be up to
            date
        </Faq>
    </div>
);
