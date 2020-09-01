/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React, { useContext, useEffect, useRef, useState } from "react";
import { List, ListRowRenderer, AutoSizer } from "react-virtualized";

import { mq, serifFont } from "../../../css";

export interface ITreeNodeData<T> {
    data: T;
    active: boolean;
    canExpand: boolean;
    expanded: boolean;
    children: ITreeNodeData<T>[];
}

export interface ITreeControlProvider {
    render: () => void;
}

export const TreeControlProvider = React.createContext<ITreeControlProvider>({
    render: () => console.log(`Tree Control Provider not initialized`)
});

enum PrefixType {
    Entry, //├
    Leaf, //└
    EmptySpacer, //' ',
    NestedSpacer //│
}

export type PrefixFormatter<T> = (node: T, i: number) => JSX.Element;
export type OnClickCallback<T> = (node: ITreeNodeData<T>) => void;
interface INodeFormatterOptions {
    canExpand: boolean;
    isExpanded: boolean;
}
export type NodeFormatter<T> = (
    node: ITreeNodeData<T>,
    path: string[],
    options: INodeFormatterOptions,
    onClick: (callback: OnClickCallback<T>) => void
) => JSX.Element;

export interface ITreeFormatter<T> {
    prefixLeafFormatter: PrefixFormatter<T>;
    prefixEntryFormatter: PrefixFormatter<T>;
    prefixEmptySpacerFormatter: PrefixFormatter<T>;
    prefixNestedSpacerFormatter: PrefixFormatter<T>;
    nodeFormatter: NodeFormatter<T>;
    nodeKey: (node: T) => string;
}

interface ITreeProps<T> {
    treeFormatter: ITreeFormatter<T>;
    root: ITreeNodeData<T>;
    keyFn: (node: ITreeNodeData<T>) => string;
}

export const Tree = <T,>({
    treeFormatter,
    root: _root,
    keyFn: key
}: React.PropsWithChildren<ITreeProps<T>>): React.ReactElement | null => {
    const [root, setRoot] = useState<ITreeNodeData<T>>(_root);
    const [treeData, setTreeData] = useState<ITreeListEntry<T>[]>(toTreeList([], _root, [], key));

    const rowRenderer: ListRowRenderer = ({ key, index, isScrolling, isVisible, style }) => {
        const p = treeData[index];

        return (
            <div key={key} style={style}>
                <TreeNode<T> node={p} treeFormatter={treeFormatter} />
            </div>
        );
    };

    const treeList = `treeList`;
    const treeStyle = css({
        [mq[0]]: {
            minHeight: treeData.length > 10 ? `15rem` : `${treeData.length * 1.5}rem`,
            [`.${treeList}`]: {
                outline: `none`
            }
        }
    });

    const treeControlProvider: ITreeControlProvider = {
        render: () => {
            setRoot({ ...root });
            setTreeData(toTreeList([], _root, [], key));
        }
    };

    return (
        <TreeControlProvider.Provider value={treeControlProvider}>
            <div css={treeStyle}>
                <AutoSizer defaultHeight={24}>
                    {({ height, width }) => (
                        <List
                            className={treeList}
                            overscanRowCount={10}
                            width={width}
                            height={height}
                            rowCount={treeData.length}
                            rowHeight={24}
                            rowRenderer={rowRenderer}
                        />
                    )}
                </AutoSizer>
            </div>
        </TreeControlProvider.Provider>
    );
};

function createPrefixes<T>(
    { prefixes, treeData }: ITreeListEntry<T>,
    treeFormatter: ITreeFormatter<T>
): JSX.Element[] {
    const {
        prefixEntryFormatter,
        prefixLeafFormatter,
        prefixEmptySpacerFormatter,
        prefixNestedSpacerFormatter
    } = treeFormatter;
    const allPrefixes: JSX.Element[] = [...prefixes].map((type, i) => {
        switch (type) {
            case PrefixType.Entry:
                return prefixEntryFormatter(treeData.data, i);
            case PrefixType.Leaf:
                return prefixLeafFormatter(treeData.data, i);
            case PrefixType.EmptySpacer:
                return prefixEmptySpacerFormatter(treeData.data, i);
            case PrefixType.NestedSpacer:
                return prefixNestedSpacerFormatter(treeData.data, i);
        }
    });

    return allPrefixes;
}

interface ITreeNode<T> {
    node: ITreeListEntry<T>;
    treeFormatter: ITreeFormatter<T>;
}

const TreeNode = <T,>({
    node,
    treeFormatter
}: React.PropsWithChildren<ITreeNode<T>>): React.ReactElement | null => {
    const { nodeFormatter, nodeKey } = treeFormatter;
    const treeControlProvider = useContext(TreeControlProvider);
    const treeNodeEl = useRef<HTMLDivElement>(null);
    const lineStyle = css({
        [mq[0]]: {
            display: `flex`,
            lineHeight: `1.5rem`,
            fontFamily: serifFont,
            cursor: `default`,
            flex: 1,
            overflow: `auto`,
            ":hover": {
                backgroundColor: `white`
            }
        }
    });
    const prefixes = createPrefixes(node, treeFormatter);
    const onChildClick = (callback: (node: ITreeNodeData<T>) => void): void => {
        node.treeData.active = true;
        callback(node.treeData);
    };
    const options: INodeFormatterOptions = {
        canExpand: node.treeData.canExpand,
        isExpanded: node.treeData.expanded
    };
    const nodeStyle = css({
        [mq[0]]: {
            display: `flex`,
            wordBreak: `normal`
        }
    });
    const labelNode = (
        <div css={nodeStyle}>{nodeFormatter(node.treeData, node.path, options, onChildClick)}</div>
    );

    function a11yToggle(e: React.KeyboardEvent<HTMLDivElement>): void {
        if (document.activeElement === treeNodeEl.current && e.key === " ") {
            node.treeData.expanded = !node.treeData.expanded;
            treeControlProvider.render();
        }

        e.preventDefault();
    }

    const focusStyle = css({
        [mq[0]]: {
            "&:focus": {
                backgroundColor: `white`,
                outline: 0
            }
        }
    });

    return (
        <div
            ref={treeNodeEl}
            css={[lineStyle, focusStyle]}
            tabIndex={0}
            onKeyPress={a11yToggle}
            onMouseOver={() => console.log(node.path)}
        >
            {prefixes}
            {labelNode}
        </div>
    );
};

interface ITreeListEntry<T> {
    prefixes: PrefixType[];
    treeData: ITreeNodeData<T>;
    path: string[];
}

function toTreeList<T>(
    _prefixes: ReadonlyArray<PrefixType>,
    node: ITreeNodeData<T>,
    path: string[],
    key: (node: ITreeNodeData<T>) => string
): ITreeListEntry<T>[] {
    const entries: ITreeListEntry<T>[] = [];
    const entry: ITreeListEntry<T> = {
        prefixes: [..._prefixes],
        treeData: node,
        path: [...path, key(node)]
    };

    entries.push(entry);
    if (node.expanded) {
        const updatedPrefixes: ReadonlyArray<PrefixType> = updatePrefixes(_prefixes);

        for (const [i, child] of node.children.entries()) {
            const childPrefix: PrefixType =
                i === node.children.length - 1 ? PrefixType.Leaf : PrefixType.Entry;
            const childPrefixes = [...updatedPrefixes, childPrefix];

            //dont use ...spread operator -> call stack overflow for large trees
            for (const c of toTreeList(childPrefixes, child, entry.path, key)) {
                entries.push(c);
            }
        }
    }

    return entries;
}

function updatePrefixes(_prefixes: ReadonlyArray<PrefixType>): ReadonlyArray<PrefixType> {
    const prefixes = [..._prefixes];
    const lastPrefix: PrefixType | undefined = prefixes.pop();
    const updatedPrefixes: PrefixType[] = [...prefixes];

    if (lastPrefix === PrefixType.Leaf) updatedPrefixes.push(PrefixType.EmptySpacer);
    else if (lastPrefix === PrefixType.Entry) updatedPrefixes.push(PrefixType.NestedSpacer);

    return updatedPrefixes;
}
