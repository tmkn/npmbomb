/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import * as React from "react";
import { Link } from "react-router-dom";

import { mq, serifFont, sansSerifFont, primaryColor, secondaryColor, textColor } from "../../css";
import { PrimaryButton } from "../shared/buttons/Buttons";
import { Info } from "../shared/info/Info";
import { Center } from "../shared/center/Center";
import { Divider } from "../shared/divider/Divider";

const highlightStyle = css({
    color: `${primaryColor}`
});

const Highlight: React.FC = ({ children }) => <span css={highlightStyle}>{children}</span>;

const faqStyle = css({
    fontFamily: `"${sansSerifFont}"`,
    color: `${textColor}`
});

interface IFaqProps {
    header: string;
}

const Faq: React.FC<IFaqProps> = ({ children, header }) => {
    return (
        <React.Fragment>
            <H2>> {header}</H2>
            <div css={faqStyle}>{children}</div>
        </React.Fragment>
    );
};

const h2Style = css({
    fontFamily: `"${serifFont}"`,
    color: `${secondaryColor}`,
    fontWeight: 200,
    marginBottom: "0.5rem"
});

const H2: React.FC = ({ children }) => <h2 css={h2Style}>{children}</h2>;

const style = css({
    fontFamily: `"${serifFont}"`,
    display: "flex",
    flexDirection: "column"
});

export default () => (
    <div css={style}>
        <h1>About</h1>
        <Info>
            Test your knowledge of the NPM ecosystem by guessing the number of dependencies for
            popular NPM packages.
        </Info>
        <Center>
            <Link to="/package/typescript">
                <PrimaryButton>Start</PrimaryButton>
            </Link>
        </Center>
        <Divider margin={"2rem 0"} />
        <H2>FAQ</H2>
        <Faq header="Why is it called npmbomb?">
            It's a hommage to zip bomb. According to Wikipedia a zip bomb is:
            <blockquote css={{ fontFamily: `"${serifFont}"` }}>
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
