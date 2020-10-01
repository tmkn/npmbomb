import React from "react";

export interface IAppState {
    inGameMode: boolean;
    remaining: string[];
    guesses: IGuessResult[];
    packages: string[];
}

export interface IGuessResult {
    pkgName: string;
    actualDependencies: number;
    guess: number;
}

export interface IAppContext {
    appState: IAppState;
    setAppState: (state: IAppState) => void;
}

export const AppContext = React.createContext<IAppContext>({
    appState: {
        inGameMode: false,
        guesses: [],
        remaining: [],
        packages: []
    },
    setAppState: () => {
        if (process.env.NODE_ENV !== "test") console.error(`AppContext not initialized`);
    }
});
