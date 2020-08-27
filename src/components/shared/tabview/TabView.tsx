/** @jsx jsx */
import { jsx, css, Global, SerializedStyles } from "@emotion/core";
import React, { useState, useEffect, useContext, useRef } from "react";

import {
    mq,
    textColor,
    serifFont,
    secondaryColorLight,
    secondaryColor,
    primaryColorLight,
    primaryColor,
    primaryColorDark
} from "../../../css";

interface ITabContext {
    activeTab: ITab | null;
    setActiveTab: (tab: ITab) => void;
}

const TabViewContext = React.createContext<ITabContext>({
    activeTab: null,
    setActiveTab: () => {}
});

export interface ITab {
    header: string;
    content: JSX.Element | null;
}

interface ITabView {
    tabs: ITab[];
}

const tabViewStyle = css({
    [mq[0]]: {
        display: `flex`,
        flexDirection: `column`
    }
});

const contentStyle = css({
    [mq[0]]: {
        padding: `2rem 0`
    }
});

export const TabView: React.FC<ITabView> = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState<ITab>(tabs[0]);

    return (
        <TabViewContext.Provider value={{ activeTab, setActiveTab }}>
            <div css={tabViewStyle}>
                <TabHeaders tabs={tabs} />
                <div css={contentStyle}>{activeTab.content}</div>
            </div>
        </TabViewContext.Provider>
    );
};

const tabHeadersStyle = css({
    [mq[0]]: {
        display: `flex`,
        height: `2rem`,
        ">div": {
            display: `flex`,
            justifyContent: `center`,
            fontSize: `1.5rem`,
            fontFamily: serifFont,
            flex: 1,
            alignSelf: `center`,
            cursor: `pointer`,
            whiteSpace: `nowrap`,
            overflow: `hidden`,
            "&:hover": {
                backgroundColor: `#e8eaf6`
            }
        }
    }
});

const lineStyle = css({
    [mq[0]]: {
        position: `relative`,
        height: `1px`,
        background: primaryColorDark
    }
});

const TabHeaders: React.FC<ITabView> = ({ tabs }) => {
    const { activeTab, setActiveTab } = useContext(TabViewContext);
    const lineRef = useRef<HTMLDivElement>(null);
    const [highlightWidth, setHighlightWidth] = useState<number>(0);

    const headerTabs: JSX.Element[] = tabs.map((tab, i) => {
        const isActive: boolean = tab.header === activeTab?.header;
        const tabTitleStyle = css({
            [mq[0]]: {
                color: isActive ? primaryColor : secondaryColor,
                textOverflow: `ellipsis`,
                overflow: `hidden`
            }
        });
        const onTabClick = () => {
            if (lineRef.current) {
                const { width } = lineRef.current.getBoundingClientRect();

                lineRef.current.style.width = `${100 / tabs.length}%`;
                lineRef.current.style.left = `${(100 / tabs.length) * i}%`;
                setHighlightWidth(width / tabs.length);
            }
            setActiveTab(tab);
        };

        return (
            <div key={i} onClick={onTabClick}>
                <span css={tabTitleStyle}>{tab.header}</span>
            </div>
        );
    });

    /* istanbul ignore next */
    useEffect(() => {
        if (lineRef.current) {
            const { width } = lineRef.current.getBoundingClientRect();

            lineRef.current.style.width = `${100 / tabs.length}%`;
            setHighlightWidth(width / tabs.length);
        }

        const handleResize = () => {
            if (lineRef.current) {
                const { width } = lineRef.current.getBoundingClientRect();

                lineRef.current.style.width = `${100 / tabs.length}%`;
                setHighlightWidth(width / tabs.length);
            }
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <React.Fragment>
            <div css={tabHeadersStyle}>{headerTabs}</div>
            <div ref={lineRef} css={lineStyle} />
        </React.Fragment>
    );
};
