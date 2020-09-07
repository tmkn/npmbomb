/** @jsx jsx */
import { jsx, css, keyframes } from "@emotion/core";
import React, { useContext, useState, useEffect, useRef, memo } from "react";
import { BehaviorSubject } from "rxjs";
import { debounceTime, distinctUntilChanged, filter } from "rxjs/operators";
import { List, ListRowRenderer, AutoSizer } from "react-virtualized";

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
import { AppContext } from "../../AppContext";
import { Info } from "../shared/info/Info";
import { LoadingIndicator } from "../shared/loading/LoadingIndicator";
import { TokenHighlighter, TokenFormatter } from "../tokenhighlighter/TokenHighlighter";

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
        input: {
            flex: 1,
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

const ResultListing: React.FC<{ packages: string[] }> = ({ packages }) => {
    const countStyle = css({
        [mq[0]]: {
            fontFamily: serifFont,
            marginBottom: "1rem"
        }
    });

    const resultsStyle = css({
        [mq[0]]: {
            minHeight: `300px`
        }
    });

    const rowStyle = css({
        overflow: "auto"
    });

    const rowRenderer: ListRowRenderer = ({ key, index, isScrolling, isVisible, style }) => {
        const p = packages[index];

        return (
            <div key={key} style={style} css={rowStyle}>
                <OverviewLink key={p} p={p} />
            </div>
        );
    };

    return (
        <React.Fragment>
            <span css={countStyle}>Found {packages.length} packages</span>
            <div css={resultsStyle}>
                <AutoSizer defaultHeight={600}>
                    {({ height, width }) => (
                        <List
                            overscanRowCount={10}
                            width={width}
                            height={height}
                            rowCount={packages.length}
                            rowHeight={30}
                            rowRenderer={rowRenderer}
                        />
                    )}
                </AutoSizer>
            </div>
        </React.Fragment>
    );
};

const tokenFormatterStyle = css({
    [mq[0]]: {
        fontWeight: "bold"
    }
});

const tokenFormatter: TokenFormatter = (token, i) => {
    return (
        <span key={i} css={tokenFormatterStyle}>
            {token}
        </span>
    );
};

const overviewLinkStyle = css({
    [mq[0]]: {
        textDecoration: "underline",
        textDecorationColor: secondaryColor,
        color: primaryColor,
        cursor: "pointer",
        whiteSpace: "pre",
        paddingLeft: "1rem",
        ":hover": {
            backgroundColor: primaryColorLight,
            color: secondaryColorLight
        }
    }
});

const OverviewLink: React.FC<{ p: string }> = ({ p }) => {
    const { query } = useContext(OverviewContext);

    return (
        <a css={overviewLinkStyle} href={`/package/${p}`}>
            <TokenHighlighter text={p} highlight={query} formatter={tokenFormatter} />
        </a>
    );
};

const OverviewSearch: React.FC = () => {
    const inputEl = useRef<HTMLInputElement>(null);
    let [inputObserver] = useState(() => new BehaviorSubject<string>(null!));
    const [query, setQuery] = useState<string>("");
    const overviewContext = useContext(OverviewContext);

    useEffect(() => {
        inputObserver
            .pipe(debounceTime(250))
            .pipe(filter(value => value !== null))
            .pipe(distinctUntilChanged())
            .subscribe(value => {
                overviewContext.setQuery(value);
            });

        return () => {
            inputObserver.unsubscribe();
        };
    }, []);

    function doQuery(e: React.ChangeEvent<HTMLInputElement>) {
        inputObserver.next(e.target.value);
        setQuery(e.target.value);
    }

    return (
        <Info>
            <input
                ref={inputEl}
                type="text"
                placeholder={`Search packages`}
                value={query}
                onChange={doQuery}
            />
        </Info>
    );
};

const NoOverviewResults: React.FC = () => {
    const { query } = useContext(OverviewContext);

    return <React.Fragment>No packages found that contain "{query}"</React.Fragment>;
};
