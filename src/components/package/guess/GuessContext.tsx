import React from "react";
import { IPackageInfo } from "../PackageData";

export interface IGuessContext {
    package: IPackageInfo;
    guess: number | undefined;
    setUserGuess: (guess: number) => void;
}

export const GuessContext = React.createContext<IGuessContext>({
    package: {
        name: "",
        version: "",
        dependencies: 0,
        distinctDependencies: 0,
        directDependencies: 0,
        description: "",
        tree: {
            data: [],
            tree: { id: 0 }
        }
    },
    guess: undefined,
    setUserGuess: () => {}
});
