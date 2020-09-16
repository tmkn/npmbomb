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
import { Info } from "../shared/info/Info";
import { GuessContext } from "./guess/GuessContext";
import {
    ITreeNodeData,
    NodeFormatter,
    OnClickCallback,
    PrefixFormatter,
    ITreeFormatter,
    Tree,
    TreeControlProvider
} from "../shared/tree/Tree";
import { LoadingIndicator } from "../shared/loading/LoadingIndicator";
import { ErrorBanner } from "./ErrorComponent";
import { IDependencyTreeStructure, ITreeData } from "../../../tools/npmdata/utils";

export interface IDependencyTreeNodeData extends ITreeData {
    dependencies: IDependencyTreeNodeData[];
}

function mapTree(
    lookup: Map<number, ITreeData>,
    { id, dependencies = [] }: IDependencyTreeStructure
): IDependencyTreeNodeData {
    const info = lookup.get(id);

    if (typeof info === "undefined") throw new Error(`Couldn't find data for ${id}`);

    const root: IDependencyTreeNodeData = {
        id: info.id,
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

export const DependencyTreeTab: React.FC = () => {
    const [isError, setError] = useState<boolean>(false);
    const [treeData, setTreeData] = useState<ITreeNodeData<IDependencyTreeNodeData>>();
    const {
        package: { tree }
    } = useContext(GuessContext);

    useEffect(() => {
        try {
            const lookup: [number, ITreeData][] = tree.data.map(data => [data.id, data]);
            const treeData = convertToTree(mapTree(new Map(lookup), tree.tree));
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

interface IDependencyTreeProps {
    root: ITreeNodeData<IDependencyTreeNodeData>;
}

export const DependencyTree: React.FC<IDependencyTreeProps> = ({ root }) => {
    const nodeFormatter: NodeFormatter<IDependencyTreeNodeData> = (
        node,
        path,
        options,
        onClick
    ) => {
        const treeControlProvider = useContext(TreeControlProvider);
        const customClick: OnClickCallback<IDependencyTreeNodeData> = node => {};

        /* istanbul ignore next */
        const expandClick = () => {
            if (options.canExpand) {
                node.expanded = !node.expanded;
                treeControlProvider.render();
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
        const label: string = `${node.data.name}@${node.data.version}`;
        const labelStyle = css({
            [mq[0]]: {
                display: `flex`,
                fontFamily: monospaceFont,
                marginLeft: options.canExpand ? 0 : `1rem`,
                whiteSpace: `nowrap`
            }
        });

        return (
            <React.Fragment>
                {expandEl}
                <span css={labelStyle} onClick={() => onClick(customClick)}>
                    <span>{label}</span>
                    <Count
                        count={node.data.count}
                        name={node.data.name}
                        version={node.data.version}
                    />
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

    return <Tree<IDependencyTreeNodeData> treeFormatter={treeFormatter} root={root} keyFn={key} />;
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

interface ICountProps {
    count: number;
    name: string;
    version: string;
}
const Count: React.FC<ICountProps> = ({ count, name, version }) => {
    const style = css({
        [mq[0]]: {
            fontFamily: serifFont,
            color: `black`,
            marginLeft: `0.5rem`
        }
    });
    const title = `${name}@${version} resolves to ${count} transitive dependencies`;

    return (
        <span css={style} title={title}>
            ({count})
        </span>
    );
};

interface INpmLinkProps {
    name: string;
    version: string;
}
const NpmLink: React.FC<INpmLinkProps> = ({ name, version }) => {
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
    const focusStyle = css({
        [mq[0]]: {
            "&:focus": {
                outlineOffset: "0.2rem"
            }
        }
    });
    const link = `https://www.npmjs.com/package/${encodeURIComponent(name)}/v/${encodeURIComponent(
        version
    )}`;

    return (
        <a css={[style, focusStyle]} href={link} target="_blank">
            <div className="codicon codicon-link-external"></div>
        </a>
    );
};
