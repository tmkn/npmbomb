/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import { List, ListRowRenderer, AutoSizer } from "react-virtualized";

import { mq, serifFont } from "../../../css";
import { IDependencyTreeData } from "../../package/Package";

export interface ITreeNodeData<T> {
    data: T;
    active: boolean;
    canExpand: boolean;
    expanded: boolean;
    children: ITreeNodeData<T>[];
}

enum PrefixType {
    Entry, //├
    Leaf, //└
    EmptySpacer, //' ',
    NestedSpacer //│
}

export type PrefixFormatter<T> = (node: T, i: number) => JSX.Element;
export type OnClickCallback<T> = (node: ITreeNodeData<T>, equals: ITreeNodeData<T>[]) => void;
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

interface ITreeUtilty<T> {
    root: ITreeNodeData<T>;
    render: () => void;
    forEach: (callback: (node: ITreeNodeData<T>) => void) => void;
}

export class TreeUtility<T> implements ITreeUtilty<T> {
    constructor(
        public root: ITreeNodeData<T>,
        private _setRoot: React.Dispatch<React.SetStateAction<ITreeNodeData<T>>>
    ) {}

    render(): void {
        this._setRoot({ ...this.root });
    }

    forEach(callback: (node: ITreeNodeData<T>) => void): void {
        this._visit(this.root, callback);
    }

    private _visit(node: ITreeNodeData<T>, callback: (node: ITreeNodeData<T>) => void): void {
        callback(node);

        for (const child of node.children) {
            this._visit(child, callback);
        }
    }
}

interface ITreeProps<T> {
    treeFormatter: ITreeFormatter<T>;
    root: ITreeNodeData<T>;
    equal: (node: ITreeNodeData<T>, path: string[]) => string;
}

export const Tree: React.FC<ITreeProps<IDependencyTreeData>> = ({
    treeFormatter,
    root: _root,
    equal
}) => {
    console.time(`toTreeList`);
    const treeList1 = toTreeList<IDependencyTreeData>([], _root);
    console.timeEnd(`toTreeList`);

    const rowRenderer: ListRowRenderer = ({ key, index, isScrolling, isVisible, style }) => {
        const p = treeList1[index];

        return (
            <div key={key} style={style}>
                <TreeNode node={p} treeFormatter={treeFormatter} />
            </div>
        );
    };

    const treeList = `treeList`;
    const treeStyle = css({
        [mq[0]]: {
            minHeight: treeList1.length > 10 ? `15rem` : `${treeList1.length * 1.5}rem`,
            [`.${treeList}`]: {
                outline: `none`
            }
        }
    });

    return (
        <div css={treeStyle}>
            <AutoSizer defaultHeight={24}>
                {({ height, width }) => (
                    <List
                        className={treeList}
                        overscanRowCount={10}
                        width={width}
                        height={height}
                        rowCount={treeList1.length}
                        rowHeight={24}
                        rowRenderer={rowRenderer}
                    />
                )}
            </AutoSizer>
        </div>
    );
};

function createPrefixes(
    { prefixes, treeData }: ITreeListEntry<IDependencyTreeData>,
    treeFormatter: ITreeFormatter<IDependencyTreeData>
): Array<JSX.Element | null> {
    const {
        prefixEntryFormatter,
        prefixLeafFormatter,
        nodeFormatter,
        prefixEmptySpacerFormatter,
        prefixNestedSpacerFormatter,
        nodeKey
    } = treeFormatter;
    const allPrefixes: Array<JSX.Element | null> = [...prefixes].map((type, i) => {
        switch (type) {
            case PrefixType.Entry:
                return prefixEntryFormatter(treeData.data, i);
            case PrefixType.Leaf:
                return prefixLeafFormatter(treeData.data, i);
            case PrefixType.EmptySpacer:
                return prefixEmptySpacerFormatter(treeData.data, i);
            case PrefixType.NestedSpacer:
                return prefixNestedSpacerFormatter(treeData.data, i);
            default:
                let unhandled: never = type;
                console.log(`Unknown prefix type: "${type}"`);

                return null;
        }
    });

    return allPrefixes;
}

interface ITreeNode {
    node: ITreeListEntry<IDependencyTreeData>;
    treeFormatter: ITreeFormatter<IDependencyTreeData>;
}

const TreeNode: React.FC<ITreeNode> = ({ node, treeFormatter }) => {
    const { nodeFormatter, nodeKey } = treeFormatter;
    const lineStyle = css({
        [mq[0]]: {
            display: `flex`,
            lineHeight: `1.5rem`,
            fontFamily: serifFont,
            cursor: `default`,
            flex: 1,
            ":hover": {
                backgroundColor: `white`
            }
        }
    });
    const prefixes = createPrefixes(node, treeFormatter);
    const onChildClick = (
        callback: (
            node: ITreeNodeData<IDependencyTreeData>,
            equals: ITreeNodeData<IDependencyTreeData>[]
        ) => void
    ): void => {
        node.treeData.active = true;
        callback(node.treeData, [
            /*todo path*/
        ]);
    };
    const options: INodeFormatterOptions = {
        canExpand: node.treeData.canExpand,
        isExpanded: node.treeData.expanded
    };
    const nodeStyle = css({
        [mq[0]]: {
            display: `flex`,
            overflow: `auto`,
            wordBreak: `normal`
        }
    });
    const labelNode = (
        <div css={nodeStyle}>
            {nodeFormatter(
                node.treeData,
                [
                    /*todo path*/
                ],
                options,
                onChildClick
            )}
        </div>
    );

    return (
        <div css={lineStyle}>
            {prefixes}
            {labelNode}
        </div>
    );
};

interface ITreeListEntry<T> {
    prefixes: PrefixType[];
    treeData: ITreeNodeData<T>;
}

function toTreeList<T>(
    _prefixes: ReadonlyArray<PrefixType>,
    node: ITreeNodeData<T>
): ITreeListEntry<T>[] {
    //console.log(_prefixes, (node.data as any).name);

    const prefixes = [..._prefixes];
    const lastPrefix: PrefixType | undefined = prefixes.pop();
    const updatedPrefixes: PrefixType[] =
        lastPrefix === PrefixType.Leaf
            ? [...prefixes, PrefixType.EmptySpacer]
            : lastPrefix === PrefixType.Entry
            ? [...prefixes, PrefixType.NestedSpacer]
            : [...prefixes];
    const entries: ITreeListEntry<T>[] = [];
    const entry: ITreeListEntry<T> = {
        prefixes: [..._prefixes],
        treeData: node
    };

    entries.push(entry);
    if (node.expanded)
        for (const [i, child] of node.children.entries()) {
            const childPrefix: PrefixType =
                i === node.children.length - 1 ? PrefixType.Leaf : PrefixType.Entry;
            const childPrefixes = [...updatedPrefixes, childPrefix];

            //dont use ...spread operator -> call stack overflow for large trees
            for (const c of toTreeList(childPrefixes, child)) {
                entries.push(c);
            }
        }

    return entries;
}
