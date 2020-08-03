import React, { useState } from "react";

let id = 0;

interface ITreeNode<T> {
    data: T;
    active: boolean;
    children: ITreeNode<T>[];
}

interface ITestNode {
    label: string;
}

const nodes: ITreeNode<ITestNode> = {
    data: { label: `root` },
    active: false,
    children: [
        {
            data: { label: `child 1` },
            active: false,
            children: [
                {
                    data: { label: `child 1 1` },
                    active: false,
                    children: []
                },
                {
                    data: { label: `child 1 2` },
                    active: false,
                    children: [
                        {
                            data: { label: `child 1 2 1` },
                            active: false,
                            children: []
                        }
                    ]
                }
            ]
        },
        {
            data: { label: `child 2` },
            active: false,
            children: []
        }
    ]
};

enum PrefixType {
    Entry, //├
    Leaf, //└
    EmptySpacer, //' ',
    NestedSpacer //│
}

interface ITreeFormatter<T> {
    prefixLeafFormatter: (node: T, i: number) => JSX.Element;
    prefixEntryFormatter: (node: T, i: number) => JSX.Element;
    prefixEmptySpacerFormatter: (node: T, i: number) => JSX.Element;
    prefixNestedSpacerFormatter: (node: T, i: number) => JSX.Element;
    nodeFormatter: (
        node: ITreeNode<T>,
        path: string[],
        onClick: (callback: (node: ITreeNode<T>, equals: ITreeNode<T>[]) => void) => void
    ) => JSX.Element;
    nodeKey: (node: T) => string;
}

interface ITreeUtilty<T> {
    root: ITreeNode<T>;
    render: () => void;
    forEach: (callback: (node: ITreeNode<T>) => void) => void;
}

class TreeUtility<T> implements ITreeUtilty<T> {
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

export const Tree: React.FC<ITreeProps<ITestNode>> = ({ treeFormatter, root: _root, equal }) => {
    const nodes: JSX.Element[] = visit(
        _root,
        0,
        1,
        [],
        [],
        treeFormatter,
        new Map<string, Set<ITreeNode<ITestNode>>>(),
        equal,
        true
    );

    return <pre>{nodes}</pre>;
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
    const node = <div>{nodeFormatter(parent, [...path, nodeKey(parent.data)], onChildClick)}</div>;
    const lastPrefix = prefixes.pop();

    if (typeof lastPrefix !== "undefined") {
        if (lastPrefix === PrefixType.Leaf) prefixes.push(PrefixType.EmptySpacer);
        else if (lastPrefix === PrefixType.Entry) {
            prefixes.push(PrefixType.NestedSpacer);
        }
    }

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

    const childKey = { ...parent };
    childKey.children = [];

    treeNodes.push(
        <div key={JSON.stringify(childKey)} style={{ display: `flex` }}>
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

    for (const [i, child] of parent.children.entries()) {
        treeNodes.push(
            ...visit(
                child,
                i,
                parent.children.length,
                [...prefixes],
                [...path, nodeKey(parent.data)],
                treeFormatter,
                equalLookup,
                equal
            )
        );
    }

    return treeNodes;
}

const fooasdf = createMockData(10, 2); //nodes

export const TreeTest: React.FC = () => {
    const [root, setRoot] = useState<ITreeNode<ITestNode>>(fooasdf);
    const nodeFormatter = (
        node: ITreeNode<ITestNode>,
        path: string[],
        onClick: (
            callback: (node: ITreeNode<ITestNode>, equals: ITreeNode<ITestNode>[]) => void
        ) => void
    ) => {
        const customClick = (node: ITreeNode<ITestNode>, equals: ITreeNode<ITestNode>[]) => {
            const treeUtility = new TreeUtility(root, setRoot);
            console.log(node.data.label, path, node.active, equals);

            treeUtility.forEach(_node => {
                if (_node !== node) _node.active = false;
            });
            treeUtility.render();
            //setRoot({ ...root });
        };

        return (
            <span key={JSON.stringify(node)} onClick={() => onClick(customClick)}>
                {node.active ? `[${node.data.label}]` : node.data.label}
            </span>
        );
    };
    const nodeKey = (node: ITestNode) => node.label;
    const prefixEntryFormatter = (node: ITestNode, i: number): JSX.Element => {
        return <span key={i}>├</span>;
    };
    const prefixLeafFormatter = (node: ITestNode, i: number): JSX.Element => {
        return <span key={i}>└</span>;
    };
    const prefixEmptySpacerFormatter = (node: ITestNode, i: number): JSX.Element => {
        return <span key={i}> </span>;
    };
    const prefixNestedSpacerFormatter = (node: ITestNode, i: number): JSX.Element => {
        return <span key={i}>│</span>;
    };
    const treeFormatter: ITreeFormatter<ITestNode> = {
        nodeFormatter,
        nodeKey,
        prefixEntryFormatter,
        prefixLeafFormatter,
        prefixEmptySpacerFormatter,
        prefixNestedSpacerFormatter
    };
    const btnClick = () => {
        root.active = true;
        root.children = [];
        setRoot({ ...root });
    };
    const equal = (node: ITreeNode<ITestNode>): string => {
        return `${node.data.label}`;
    };

    return (
        <React.Fragment>
            <Tree treeFormatter={treeFormatter} root={root} equal={equal} />
            <button onClick={btnClick}>click</button>
        </React.Fragment>
    );
};

function createMockData(
    childCount: number,
    depth: number,
    parent?: ITreeNode<ITestNode>
): ITreeNode<ITestNode> {
    const _parent: ITreeNode<ITestNode> = parent ?? {
        active: false,
        data: { label: `foo ${id++}` },
        children: []
    };

    if (depth === 0) return _parent;

    for (let i = 0; i < childCount; i++) {
        const child: ITreeNode<ITestNode> = {
            active: false,
            children: [],
            data: { label: `label ${id++}` }
        };

        _parent.children.push(child);
        createMockData(childCount, depth - 1, child);
    }

    return _parent;
}
