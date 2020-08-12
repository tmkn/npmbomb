/** @jsx jsx */
import { jsx, css, keyframes } from "@emotion/core";
import React, { useContext, useState } from "react";

import { mq, textColor, secondaryColorLight, primaryColorDark, secondaryColor } from "../../css";
import { ResultsTable, Num } from "../shared/results/Results";
import { Divider } from "../shared/divider/Divider";
import { scaleDuration } from "./CountUp";
import { Info } from "../shared/info/Info";
import { GuessContext } from "./GuessBox";
import { TextLink } from "../shared/link/TextLink";
import { TabView, ITab } from "../shared/tabview/TabView";
import {
    ITreeNode,
    NodeFormatter,
    OnClickCallback,
    PrefixFormatter,
    ITreeFormatter,
    Tree,
    TreeUtility
} from "../shared/tree/Tree";
import { IDependencyTreeData } from "./Package";

function plural(count: number): string {
    return count === 1 ? "dependency" : "dependencies";
}

export const SummaryTabs: React.FC = () => {
    const tabs: ITab[] = [
        { header: `Summary`, content: <DependencyOverviewTab /> },
        {
            header: `Dependency Tree`,
            content: <DependencyTreeTab />
        }
    ];

    return <TabView tabs={tabs} />;
};

const DependencyOverviewTab: React.FC = () => {
    const { package: pkg } = useContext(GuessContext);

    return (
        <React.Fragment>
            <Info>
                <span>
                    <TextLink href={`https://www.npmjs.com/package/${pkg.name}/v/${pkg.version}`}>
                        {pkg.name}@{pkg.version}
                    </TextLink>{" "}
                    defines{" "}
                    <b>
                        {pkg.directDependencies} direct {plural(pkg.directDependencies)}
                    </b>{" "}
                    which explode into{" "}
                    <b>
                        {pkg.dependencies} {plural(pkg.dependencies)} overall
                    </b>
                    , resulting in{" "}
                    <b>
                        {pkg.distinctDependencies} distinct {plural(pkg.distinctDependencies)}
                    </b>
                    .
                </span>
            </Info>
        </React.Fragment>
    );
};

const DependencyTreeTab: React.FC = () => {
    const {
        package: { dependencyTree }
    } = useContext(GuessContext);
    const treeData = convertToTree(dependencyTree);
    return (
        <Info>
            <DependencyTree root={treeData} />
        </Info>
    );
};

const DependencyTree: React.FC<{ root: ITreeNode<IDependencyTreeData> }> = ({ root: _root }) => {
    const [root, setRoot] = useState<ITreeNode<IDependencyTreeData>>(_root);
    const nodeFormatter: NodeFormatter<IDependencyTreeData> = (node, path, options, onClick) => {
        const customClick: OnClickCallback<IDependencyTreeData> = (node, equals) => {
            const treeUtility = new TreeUtility(root, setRoot);

            treeUtility.forEach(_node => {
                if (_node !== node) _node.active = false;
            });
            treeUtility.render();
            //setRoot({ ...root });
        };

        const expandClick = () => {
            if (options.canExpand) {
                node.expanded = !node.expanded;
                setRoot({ ...root });
            }
        };

        const expandElStyle = css({
            [mq[0]]: {
                minWidth: `1rem`,
                fontFamily: `IconFont`
            }
        });
        const expandEl: JSX.Element | null = options.canExpand ? (
            <span css={expandElStyle} onClick={expandClick}>
                {options.isExpanded ? (
                    <div className="codicon codicon-chevron-down"></div>
                ) : (
                    <div className="codicon codicon-chevron-right"></div>
                )}
            </span>
        ) : null;
        const Count: React.FC = () => {
            const style = css({
                [mq[0]]: {
                    color: `black`,
                    marginLeft: `0.5rem`
                }
            });

            return <span css={style}>({node.data.transitiveCount})</span>;
        };
        const label: string = `${node.data.name}@${node.data.version}`;

        return (
            <React.Fragment>
                {expandEl}
                <span
                    key={`${JSON.stringify(node)} ${JSON.stringify(path)}`}
                    onClick={() => onClick(customClick)}
                >
                    {label}
                    <Count />
                </span>
            </React.Fragment>
        );
    };
    const nodeKey = (node: IDependencyTreeData) => `${node.name}@${node.version}`;
    const treeIdentationStyle = css({
        [mq[0]]: {
            minWidth: `1rem`,
            borderLeft: `1px solid ${secondaryColor}`
        }
    });
    //├
    const prefixEntryFormatter: PrefixFormatter<IDependencyTreeData> = (node, i) => {
        return <span key={i} css={treeIdentationStyle}></span>;
    };
    //└
    const prefixLeafFormatter: PrefixFormatter<IDependencyTreeData> = (node, i) => {
        return <span key={i} css={treeIdentationStyle}></span>;
    };
    const prefixEmptySpacerFormatter: PrefixFormatter<IDependencyTreeData> = (node, i) => {
        const style = css({
            [mq[0]]: {
                minWidth: `1rem`
            }
        });

        return <span key={i} css={style}></span>;
    };
    //│
    const prefixNestedSpacerFormatter: PrefixFormatter<IDependencyTreeData> = (node, i) => {
        return <span key={i} css={treeIdentationStyle}></span>;
    };
    const treeFormatter: ITreeFormatter<IDependencyTreeData> = {
        nodeFormatter,
        nodeKey,
        prefixEntryFormatter,
        prefixLeafFormatter,
        prefixEmptySpacerFormatter,
        prefixNestedSpacerFormatter
    };
    const equal = (node: ITreeNode<IDependencyTreeData>): string => {
        return `${node.data.name}@${node.data.version}`;
    };

    return <Tree treeFormatter={treeFormatter} root={root} equal={equal} />;
};

export interface IDependencyTreeStructure {
    id: number;
    dependencies: number[];
}

export interface IDependencyTreeInfo {
    lookup: IDependencyTreeData[];
    root: IDependencyTreeStructure;
}

function convertToTree(root: IDependencyTreeData): ITreeNode<IDependencyTreeData> {
    const node: ITreeNode<IDependencyTreeData> = {
        data: root,
        active: false,
        canExpand: root.dependencies.length > 0,
        children: [],
        expanded: false
    };

    for (const child of root.dependencies) {
        node.children.push(convertToTree(child));
    }

    return node;
}

interface IResultBoxProps {
    guess: number;
    actual: number;
    distinct: number;
}

export const ResultBox: React.FC<IResultBoxProps> = ({ guess, actual, distinct }) => {
    const fadeIn = keyframes`
        from {
            height: 0;
            opacity: 0;
        }

        to {
            height: auto;
            opacity: 1;
        }
    `;

    const containerStyle = css({
        [mq[0]]: {
            //display: "none",
            opacity: 0,
            height: 0,
            animation: `${fadeIn} 500ms ease forwards`,
            animationDelay: `${scaleDuration}ms`,
            h2: {
                marginTop: 0
            }
        }
    });

    const resultStyle = css({
        [mq[0]]: {
            marginBottom: "1rem",
            color: textColor
        }
    });

    const distance = Math.abs(guess - actual);

    return (
        <div css={containerStyle}>
            {actual > 0 && <SummaryTabs />}
            {guess !== actual && (
                <React.Fragment>
                    <h2>Results</h2>
                    <Divider margin={"1rem 0"} />
                    <ResultsTable columns={2}>
                        <div>Your Guess:</div>
                        <Num>{guess}</Num>
                        <div>Actual:</div>
                        <Num>{actual}</Num>
                    </ResultsTable>
                    <Divider margin={"1rem 0"} />
                    <div css={resultStyle}>
                        <React.Fragment>
                            You were off by <Num>{distance}</Num>
                        </React.Fragment>
                    </div>
                </React.Fragment>
            )}
        </div>
    );
};
