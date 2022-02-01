/** @jsx jsx */
import { jsx, css, Global, SerializedStyles } from "@emotion/react";
import React, { useState, lazy, Suspense } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

const Index = lazy(() => import("./components/index/Index"));
const Package = lazy(() => import("./components/package/Package"));
const Results = lazy(() => import("./components/results/Results"));
const Overview = lazy(() => import("./components/overview/Overview"));

import { AppContext, IAppContext, IAppState, IGuessResult } from "./AppContext";
import Header from "./components/shared/header/Header";
import Content from "./components/shared/content/Content";
import Footer from "./components/shared/footer/Footer";
import { LoadingIndicator } from "./components/shared/loading/LoadingIndicator";
import { serifFont, sansSerifFont, primaryColor, secondaryColor, globalFocusStyle } from "./css";
import IconFont from "./codicon.ttf";
import "./codicon.css";

const globalStyle: SerializedStyles = css`
    @import url("https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300&display=swap");

    body {
        background: white;
        margin: 0;
        padding: 0;
        min-height: 100vh;
        max-width: 100vw;
        display: flex;
        flex-direction: column;
        font-family: "${sansSerifFont}";
    }

    a {
        text-decoration: none;
    }

    h1 {
        font-family: "${serifFont}";
        color: ${primaryColor};
        font-weight: 200;
    }

    h2 {
        font-family: "${serifFont}";
        color: ${secondaryColor};
        font-weight: 200;
    }

    @font-face {
        font-family: "IconFont";
        src: url(${IconFont}) format("ttf");
    }

    @font-face {
        font-family: "Muli";
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/muli/v17/7Aulp_0qiz-aVz7u3PJLcUMYOFkpl0k30e6fwniDtzM.woff)
            format("woff");
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,
            U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    @font-face {
        font-family: "Roboto Slab";
        font-style: normal;
        font-weight: 200;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/robotoslab/v10/BngbUXZYTXPIvIBgJJSb6s3BzlRRfKOFbvjoDISmb2RlV9Su1cai.woff)
            format("woff");
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,
            U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    @font-face {
        font-family: "Roboto Slab";
        font-style: normal;
        font-weight: 600;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/robotoslab/v10/BngMUXZYTXPIvIBgJJSb6ufN5qWr4xCC.woff2)
            format("woff2");
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,
            U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }

    @font-face {
        font-family: "Open Sans";
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: local("Open Sans Regular"), local("OpenSans-Regular"),
            url(https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0bf8pkAg.woff2)
                format("woff2");
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,
            U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
`;

export const App: React.FC = () => {
    const [appState, setAppState] = useState<IAppState>({
        inGameMode: false,
        guesses: [],
        remaining: [],
        packages: []
    });

    const context: IAppContext = {
        appState,
        setAppState
    };

    return (
        <AppContext.Provider value={context}>
            <BrowserRouter>
                <Global styles={[globalStyle, globalFocusStyle]} />
                <Header />
                <Content>
                    <Switch>
                        <Route path="/package">
                            <Suspense fallback={<LoadingIndicator />}>
                                <Package />
                            </Suspense>
                        </Route>
                        <Route path="/results">
                            <Suspense fallback={<LoadingIndicator />}>
                                <Results />
                            </Suspense>
                        </Route>
                        <Route path="/overview">
                            <Suspense fallback={<LoadingIndicator />}>
                                <Overview />
                            </Suspense>
                        </Route>
                        <Route path="/">
                            <Suspense fallback={<LoadingIndicator />}>
                                <Index />
                            </Suspense>
                        </Route>
                        <Redirect to="/" />
                    </Switch>
                </Content>
                <Footer />
            </BrowserRouter>
        </AppContext.Provider>
    );
};
