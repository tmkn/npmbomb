/** @jsx jsx */
import { jsx, css, keyframes } from "@emotion/core";
import React, { useContext, useEffect, useState } from "react";
import * as Sentry from "@sentry/browser";

import {
    mq,
    textColor,
    secondaryColorLight,
    primaryColorDark,
    secondaryColor,
    monospaceFont,
    serifFont
} from "../../css";
import { ResultsTable, Num } from "../shared/results/ResultsTable";
import { Divider } from "../shared/divider/Divider";
import { scaleDuration } from "./CountUp";
import { Info } from "../shared/info/Info";
import { GuessContext } from "./GuessBox";
import { TextLink } from "../shared/link/TextLink";
import { TabView, ITab } from "../shared/tabview/TabView";
import {
    ITreeNodeData,
    NodeFormatter,
    OnClickCallback,
    PrefixFormatter,
    ITreeFormatter,
    Tree,
    TreeUtility,
    toTreeList
} from "../shared/tree/Tree";
import { LoadingIndicator } from "../shared/loading/LoadingIndicator";
import { ErrorBanner } from "./ErrorComponent";
import { IDependencyTreeNodeData } from "./Package";
import { IDependencyTreeStructure, ITreeData } from "../../../tools/npmdata/utils";

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
    );
};

function mapTree(
    lookup: Map<string, ITreeData>,
    { id, dependencies = [] }: IDependencyTreeStructure
): IDependencyTreeNodeData {
    const info = lookup.get(id);

    if (typeof info === "undefined") throw new Error(`Couldn't find data for ${id}`);

    const root: IDependencyTreeNodeData = {
        name: info.name,
        version: info.version,
        count: info.count,
        dependencies: []
    };

    for (const dependency of dependencies) {
        root.dependencies.push(mapTree(lookup, dependency));
    }

    return root;
}

const DependencyTreeTab: React.FC = () => {
    const [isError, setError] = useState<boolean>(false);
    const [treeData, setTreeData] = useState<ITreeNodeData<IDependencyTreeNodeData>>();
    const {
        package: { tree }
    } = useContext(GuessContext);

    useEffect(() => {
        try {
            const treeData = convertToTree(mapTree(new Map(tree.data), tree.tree));
            treeData.expanded = true;

            setTreeData(treeData);
        } catch {
            setError(true);
            Sentry.captureMessage(`Couldn't display dependency tree`);
        }
    }, []);

    if (isError) return <ErrorBanner>Whoops, cannot display dependency tree</ErrorBanner>;

    if (typeof treeData !== "undefined")
        return (
            <Info>
                <DependencyTree root={treeData} />
            </Info>
        );

    return (
        <Info>
            <LoadingIndicator />
        </Info>
    );
};

const DependencyTree: React.FC<{ root: ITreeNodeData<IDependencyTreeNodeData> }> = ({
    root: _root
}) => {
    const [root, setRoot] = useState<ITreeNodeData<IDependencyTreeNodeData>>(_root);
    const nodeFormatter: NodeFormatter<IDependencyTreeNodeData> = (
        node,
        path,
        options,
        onClick
    ) => {
        const customClick: OnClickCallback<IDependencyTreeNodeData> = node => {
            /*const treeUtility = new TreeUtility(root, setRoot);

            treeUtility.forEach(_node => {
                if (_node !== node) _node.active = false;
            });
            treeUtility.render();
            //setRoot({ ...root });*/
        };

        /* istanbul ignore next */
        const expandClick = () => {
            if (options.canExpand) {
                node.expanded = !node.expanded;
                setRoot({ ...root });
            }
        };

        const expandElStyle = css({
            [mq[0]]: {
                fontFamily: `IconFont`,
                cursor: `pointer`,
                ">div": {
                    verticalAlign: `middle`
                }
            }
        });
        const expandEl: JSX.Element | null = options.canExpand ? (
            <span
                css={expandElStyle}
                onClick={expandClick}
                data-testid={`${node.data.name}@${node.data.version}`}
            >
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
                    fontFamily: serifFont,
                    color: `black`,
                    marginLeft: `0.5rem`
                }
            });

            return <span css={style}>({node.data.count})</span>;
        };
        const label: string = `${node.data.name}@${node.data.version}`;
        const labelStyle = css({
            [mq[0]]: {
                display: `flex`,
                fontFamily: monospaceFont,
                marginLeft: options.canExpand ? 0 : `1rem`,
                whiteSpace: `nowrap`
            }
        });

        const NpmLink: React.FC<{ name: string; version: string }> = ({ name, version }) => {
            const style = css({
                [mq[0]]: {
                    marginLeft: `0.5rem`,
                    textDecoration: `none`,
                    color: `black`,
                    display: `flex`,
                    alignSelf: `center`,
                    ">div": {
                        fontFamily: `IconFont`
                    }
                }
            });
            const link = `https://www.npmjs.com/package/${encodeURIComponent(
                name
            )}/v/${encodeURIComponent(version)}`;

            return (
                <a css={style} href={link} target="_blank">
                    <div className="codicon codicon-link-external"></div>
                </a>
            );
        };

        return (
            <React.Fragment>
                {expandEl}
                <span css={labelStyle} onClick={() => onClick(customClick)}>
                    <span>{label}</span>
                    <Count />
                    <NpmLink name={node.data.name} version={node.data.version} />
                </span>
            </React.Fragment>
        );
    };
    const nodeKey = (node: IDependencyTreeNodeData) => `${node.name}@${node.version}`;
    const treeIdentationStyle = css({
        [mq[0]]: {
            minWidth: `1rem`,
            marginLeft: `0.5rem`,
            borderLeft: `1px solid ${secondaryColor}`
        }
    });
    //├
    const prefixEntryFormatter: PrefixFormatter<IDependencyTreeNodeData> = (node, i) => {
        return <span key={i} css={treeIdentationStyle}></span>;
    };
    //└
    const prefixLeafFormatter: PrefixFormatter<IDependencyTreeNodeData> = (node, i) => {
        return <span key={i} css={treeIdentationStyle}></span>;
    };
    const prefixEmptySpacerFormatter: PrefixFormatter<IDependencyTreeNodeData> = (node, i) => {
        return <span key={i} css={treeIdentationStyle}></span>;
    };
    //│
    const prefixNestedSpacerFormatter: PrefixFormatter<IDependencyTreeNodeData> = (node, i) => {
        return <span key={i} css={treeIdentationStyle}></span>;
    };
    const treeFormatter: ITreeFormatter<IDependencyTreeNodeData> = {
        nodeFormatter,
        nodeKey,
        prefixEntryFormatter,
        prefixLeafFormatter,
        prefixEmptySpacerFormatter,
        prefixNestedSpacerFormatter
    };
    const key = (node: ITreeNodeData<IDependencyTreeNodeData>): string => {
        return `${node.data.name}@${node.data.version}`;
    };

    return (
        <React.Fragment>
            <Tree treeFormatter={treeFormatter} treeData={toTreeList([], root, [], key)} />
        </React.Fragment>
    );
};

function convertToTree(root: IDependencyTreeNodeData): ITreeNodeData<IDependencyTreeNodeData> {
    const node: ITreeNodeData<IDependencyTreeNodeData> = {
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
