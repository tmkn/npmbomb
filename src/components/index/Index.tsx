/** @jsx jsx */
import { jsx, css, keyframes } from "@emotion/react";
import React, { useContext, useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import shuffle from "lodash.shuffle";

import { mq, serifFont, sansSerifFont, secondaryColor, textColor } from "../../css";
import { PrimaryButton } from "../shared/buttons/Buttons";
import { Info } from "../shared/info/Info";
import { Center } from "../shared/center/Center";
import { Divider } from "../shared/divider/Divider";
import { AppContext } from "../../AppContext";
import { TextLink } from "../shared/link/TextLink";
import { Highlight } from "../shared/highlight/Highlight";
import { setDefaultTitle } from "../../title";

const faqStyle = css({
    [mq[0]]: {
        fontFamily: `"${sansSerifFont}"`,
        color: `${textColor}`
    }
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
    const faqEl = useRef<HTMLDivElement>(null);
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

    /* istanbul ignore next */
    function a11yToggle(e: React.KeyboardEvent<HTMLDivElement>): void {
        if (document.activeElement === faqEl.current && e.key === " ") {
            setExpandend(!expanded);
        }

        e.preventDefault();
    }

    return (
        <div ref={faqEl} tabIndex={0} onKeyPress={a11yToggle} css={faqStyle}>
            <FaqHeading onClick={onClick}>
                <span style={{ cursor: "pointer" }}>
                    <span css={[arrowStyle, expanded ? expandStyle : collapseStyle]}>
                        <div className="codicon codicon-chevron-right"></div>
                    </span>{" "}
                    {header}
                </span>
            </FaqHeading>
            <div
                ref={contentEl}
                css={[faqStyle, expanded ? contentExpandStyle : contentCollapseStyle]}
            >
                {children}
            </div>
        </div>
    );
};

const h2Style = css({
    [mq[0]]: {
        fontFamily: `"${serifFont}"`,
        color: `${secondaryColor}`,
        fontWeight: 200,
        margin: "0.6rem 0",
        overflow: "hidden"
    }
});

interface IFaqHeadingProps {
    onClick?: (e: React.MouseEvent<HTMLHeadingElement>) => void;
}

const FaqHeading: React.FC<IFaqHeadingProps> = ({ children, onClick }) => {
    const _onClick = onClick ?? (() => {});

    return (
        <h2 css={h2Style} onClick={_onClick}>
            {children}
        </h2>
    );
};

const style = css({
    [mq[0]]: {
        fontFamily: `"${serifFont}"`,
        display: "flex",
        flexDirection: "column"
    }
});

export default () => {
    const { appState, setAppState } = useContext(AppContext);
    const history = useHistory();
    const { loading, error } = useAvailablePackagesLoader();
    const disableStart = loading === true || error === true;

    useEffect(() => {
        setDefaultTitle();
    });

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
                <PrimaryButton disabled={disableStart} onClick={onStart}>
                    Start
                </PrimaryButton>
            </Center>
            <Divider margin={"2rem 0"} />
            <FaqHeading>FAQ</FaqHeading>
            <Faq header="How is the dependency count calculated?" collapsed>
                As the dependency tree is traversed, each dependency from the dependencies field in
                the package.json is resolved according to their range and added to the overall
                count. <Highlight>It's a straight accumulation</Highlight>, as such the same package
                is counted multiple times if it is a dependency of other packages.
            </Faq>
            <Faq header="How is the distinct dependency count calculated?" collapsed>
                A dependency is distinct if after resolving it according to their range differs in
                name and version.
                <br />
                <Highlight>Multiple same version dependencies will only be counted once.</Highlight>
            </Faq>
            <Faq header="Is there an overview page?" collapsed>
                All available packages can be found on the{" "}
                <TextLink href="/overview">overview page</TextLink>
            </Faq>
            <Faq header="Why is it called npmbomb?" collapsed>
                It's a hommage to the word zip bomb. Wikipedia defines it as:
                <blockquote css={{ fontFamily: `"${serifFont}"` }}>
                    "A zip bomb is usually a small file .... however, when the file is unpacked, its
                    contents are more than the system can handle."
                </blockquote>
                Sounds familiar? 😈
            </Faq>
            <Faq header="Does it count dev dependencies?" collapsed>
                No, it only shows (and counts) dependencies from the{" "}
                <Highlight>dependencies</Highlight> field in the <Highlight>package.json</Highlight>{" "}
                all the way to the very last dependency.
            </Faq>
            <Faq header="Why can't I find library XYZ?" collapsed>
                For now, it only shows a preselected number of libraries, namely the ones that are
                in the dependency tree of the most downloaded packages. If you want a specific
                dependency or have an idea or just want to chat in general, you can contact me on
                Twitter <TextLink href="https://twitter.com/tmkndev">@tmkndev</TextLink>
            </Faq>
            <Faq header="Is it Open Source?" collapsed>
                <TextLink href="https://github.com/tmkn/npmbomb">Yes</TextLink>
            </Faq>
        </div>
    );
};

interface IAvailablePackgesHookResponse {
    packages: string[];
    loading: boolean;
    error: boolean;
}

export function useAvailablePackagesLoader(): IAvailablePackgesHookResponse {
    const { appState, setAppState } = useContext(AppContext);

    const [packages, setPackages] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    async function load(): Promise<void> {
        try {
            setLoading(true);
            setError(false);

            const packages = await fetchAvailablePackages();

            setAppState({
                ...appState,
                packages: packages
            });
            setLoading(false);
            setPackages(packages);
        } catch {
            setError(true);
            setLoading(false);
            setPackages([]);
        }
    }

    useEffect(() => {
        load();
    }, []);

    return { packages, loading, error };
}

export async function fetchAvailablePackages(): Promise<string[]> {
    const resp = await fetch(`/data/lookup.txt`);
    const text = await resp.text();

    return text
        .split("\n")
        .map(l => l.trim())
        .filter(l => l !== "");
}
