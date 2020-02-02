/** @jsx jsx */
import { jsx, css, keyframes } from "@emotion/core";
import React, { useContext, useState, useEffect, useRef } from "react";

import {
    mq,
    serifFont,
    sansSerifFont,
    primaryColor,
    secondaryColor,
    textColor,
    secondaryColorLight,
    primaryColorLight
} from "../../css";
import { useAvailablePackagesLoader } from "../index/Index";
import { AppContext } from "../../App";
import { Info } from "../shared/info/Info";
import { LoadingIndicator } from "../shared/loading/LoadingIndicator";

interface IOverviewContext {
    query: string;
    setQuery: (quer: string) => void;
}

const OverviewContext = React.createContext<IOverviewContext>({
    query: "",
    setQuery() {}
});

const overviewStyle = css({
    [mq[0]]: {
        a: {
            display: "flex",
            paddingBottom: "0.5rem"
        },
        "a:last-child": {
            paddingBottom: 0
        },
        input: {
            flex: 1,
            //fontSize: "1.1rem",
            color: primaryColor,
            border: `1px solid ${primaryColorLight}`,
            padding: "0.5rem",
            boxSizing: "border-box",
            outline: "none"
        }
    }
});

function matches(name: string, query: string): boolean {
    return new RegExp(`${query}`).test(name);
}

export default () => {
    const { loading, error } = useAvailablePackagesLoader();
    const {
        appState: { packages }
    } = useContext(AppContext);
    const [query, setQuery] = useState<string>("");
    const context: IOverviewContext = {
        query: query,
        setQuery: setQuery
    };

    if (error) return <Info>Couldn't load info</Info>;

    if (loading) return <LoadingIndicator />;

    const filteredPackages = packages.filter(p => matches(p, query)).sort();

    const ResultListing: React.FC<{ packages: string[] }> = ({ packages }) => {
        const countStyle = css({
            [mq[0]]: {
                fontFamily: serifFont,
                marginBottom: "1rem"
            }
        });

        return (
            <React.Fragment>
                <span css={countStyle}>Found {filteredPackages.length} packages</span>
                {packages.map(p => (
                    <OverviewLink key={p} p={p} />
                ))}
            </React.Fragment>
        );
    };

    return (
        <OverviewContext.Provider value={context}>
            <div css={overviewStyle}>
                <h1>Overview</h1>
                <OverviewSearch />
                <Info>
                    {filteredPackages.length === 0 ? (
                        <NoOverviewResults />
                    ) : (
                        <ResultListing packages={filteredPackages} />
                    )}
                </Info>
            </div>
        </OverviewContext.Provider>
    );
};

const overviewLinkStyle = css({
    [mq[0]]: {
        textDecoration: "underline",
        textDecorationColor: secondaryColor,
        color: primaryColor,
        cursor: "pointer"
    }
});

const OverviewLink: React.FC<{ p: string }> = ({ p }) => {
    return (
        <a css={overviewLinkStyle} href={`/package/${p}`}>
            {p}
        </a>
    );
};

const OverviewSearch: React.FC = () => {
    const [query, setQuery] = useState<string>("");
    const [dispatchText, setDispatchText] = useState<string>("");
    const overviewContext = useContext(OverviewContext);
    let timeoutId: number | undefined = undefined;

    useEffect(() => {
        timeoutId = window.setTimeout(() => setDispatchText(query), 400);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [query]);

    useEffect(() => {
        overviewContext.setQuery(dispatchText);
    }, [dispatchText]);

    function doQuery(e: React.ChangeEvent<HTMLInputElement>) {
        setQuery(e.target.value);
    }

    return (
        <Info>
            <input type="text" placeholder={`Search packages`} value={query} onChange={doQuery} />
        </Info>
    );
};

const NoOverviewResults: React.FC = () => {
    const { query } = useContext(OverviewContext);

    return <React.Fragment>No packages found that contain "{query}"</React.Fragment>;
};
