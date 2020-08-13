/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import { mq, serifFont } from "../../../css";
import { IDependencyTreeData } from "../../package/Package";

export interface ITreeNode<T> {
    data: T;
    active: boolean;
    canExpand: boolean;
    expanded: boolean;
    children: ITreeNode<T>[];
}

enum PrefixType {
    Entry, //├
    Leaf, //└
    EmptySpacer, //' ',
    NestedSpacer //│
}

export type PrefixFormatter<T> = (node: T, i: number) => JSX.Element;
export type OnClickCallback<T> = (node: ITreeNode<T>, equals: ITreeNode<T>[]) => void;
interface INodeFormatterOptions {
    canExpand: boolean;
    isExpanded: boolean;
}
export type NodeFormatter<T> = (
    node: ITreeNode<T>,
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
    root: ITreeNode<T>;
    render: () => void;
    forEach: (callback: (node: ITreeNode<T>) => void) => void;
}

export class TreeUtility<T> implements ITreeUtilty<T> {
    constructor(
        public root: ITreeNode<T>,
        private _setRoot: React.Dispatch<React.SetStateAction<ITreeNode<T>>>
    ) {}

    render(): void {
        this._setRoot({ ...this.root });
    }

    forEach(callback: (node: ITreeNode<T>) => void): void {
        this._visit(this.root, callback);
    }

    private _visit(node: ITreeNode<T>, callback: (node: ITreeNode<T>) => void): void {
        callback(node);

        for (const child of node.children) {
            this._visit(child, callback);
        }
    }
}

interface ITreeProps<T> {
    treeFormatter: ITreeFormatter<T>;
    root: ITreeNode<T>;
    equal: (node: ITreeNode<T>, path: string[]) => string;
}

export const Tree: React.FC<ITreeProps<IDependencyTreeData>> = ({
    treeFormatter,
    root: _root,
    equal
}) => {
    const nodes: JSX.Element[] = visit(
        _root,
        0,
        1,
        [],
        [],
        treeFormatter,
        new Map<string, Set<ITreeNode<IDependencyTreeData>>>(),
        equal,
        true
    );

    return <div>{nodes}</div>;
};

function visit<T>(
    parent: ITreeNode<T>,
    parentI: number,
    parentLength: number,
    prefixes: PrefixType[],
    path: string[],
    treeFormatter: ITreeFormatter<T>,
    equalLookup: Map<string, Set<ITreeNode<T>>>,
    equal: (node: ITreeNode<T>, path: string[]) => string,
    isRoot = false
): JSX.Element[] {
    const {
        prefixEntryFormatter,
        prefixLeafFormatter,
        nodeFormatter,
        prefixEmptySpacerFormatter,
        prefixNestedSpacerFormatter,
        nodeKey
    } = treeFormatter;
    const treeNodes: JSX.Element[] = [];
    const onChildClick = (callback: (node: ITreeNode<T>, equals: ITreeNode<T>[]) => void): void => {
        const key = equal(parent, path);

        parent.active = true;
        callback(parent, [...(equalLookup.get(key) ?? [])]);
    };
    const options: INodeFormatterOptions = {
        canExpand: parent.canExpand,
        isExpanded: parent.expanded
    };
    const nodeStyle = css({
        [mq[0]]: {
            display: `flex`,
            overflow: `auto`,
            wordBreak: `normal`,
            flex: 1,
            ":hover": {
                backgroundColor: `white`
            }
        }
    });
    const node = (
        <div css={nodeStyle}>
            {nodeFormatter(parent, [...path, nodeKey(parent.data)], options, onChildClick)}
        </div>
    );
    const lastPrefix = prefixes.pop();

    if (typeof lastPrefix !== "undefined") {
        if (lastPrefix === PrefixType.Leaf) prefixes.push(PrefixType.EmptySpacer);
        else if (lastPrefix === PrefixType.Entry) {
            prefixes.push(PrefixType.NestedSpacer);
        }
    }

    path.push(nodeKey(parent.data));

    if (!isRoot) {
        const prefixType = parentI === parentLength - 1 ? PrefixType.Leaf : PrefixType.Entry;
        prefixes.push(prefixType);
    }

    const allPrefixes: Array<JSX.Element | null> = [...prefixes].map((type, i) => {
        switch (type) {
            case PrefixType.Entry:
                return prefixEntryFormatter(parent.data, i);
            case PrefixType.Leaf:
                return prefixLeafFormatter(parent.data, i);
            case PrefixType.EmptySpacer:
                return prefixEmptySpacerFormatter(parent.data, i);
            case PrefixType.NestedSpacer:
                return prefixNestedSpacerFormatter(parent.data, i);
            default:
                let unhandled: never = type;
                console.log(`Unknown prefix type: "${type}"`);

                return null;
        }
    });

    const lineStyle = css({
        [mq[0]]: {
            display: `flex`,
            lineHeight: `1.5rem`,
            fontFamily: serifFont,
            cursor: `default`
        }
    });

    treeNodes.push(
        <div key={JSON.stringify(path)} css={lineStyle}>
            {allPrefixes}
            {node}
        </div>
    );

    //calculate equals
    const equalsKey = equal(parent, path);
    const existingEquals = equalLookup.get(equalsKey);

    if (typeof existingEquals !== "undefined") {
        existingEquals.add(parent);
    } else {
        const newEquals = new Set([parent]);

        equalLookup.set(equalsKey, newEquals);
    }

    if (parent.expanded === true)
        for (const [i, child] of parent.children.entries()) {
            treeNodes.push(
                ...visit(
                    child,
                    i,
                    parent.children.length,
                    [...prefixes],
                    [...path],
                    treeFormatter,
                    equalLookup,
                    equal
                )
            );
        }

    return treeNodes;
}
