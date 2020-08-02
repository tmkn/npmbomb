import React, { useRef, useState } from "react";

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
    prefixLeafFormatter: (node: T) => JSX.Element;
    prefixEntryFormatter: (node: T) => JSX.Element;
    prefixEmptySpacerFormatter: (node: T) => JSX.Element;
    prefixNestedSpacerFormatter: (node: T) => JSX.Element;
    nodeFormatter: (node: ITreeNode<T>, path: string[]) => JSX.Element;
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
}

export const Tree: React.FC<ITreeProps<ITestNode>> = ({ treeFormatter, root: _root }) => {
    const [root, setRoot] = useState<ITreeNode<ITestNode>>(_root);
    const treeUtility = new TreeUtility(root, setRoot);

    const nodes: JSX.Element[] = visit(root, 0, 1, [], [], treeFormatter, treeUtility, true);

    return <pre>{nodes}</pre>;
};

function visit<T>(
    parent: ITreeNode<T>,
    parentI: number,
    parentLength: number,
    prefixes: PrefixType[],
    path: string[],
    treeFormatter: ITreeFormatter<T>,
    treeUtility: ITreeUtilty<T>,
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
    const onClick = (node: ITreeNode<T>) => {
        treeUtility.forEach(node => (node.active = false));
        node.active = true;
        console.log(`onClick`);
        treeUtility.render();
    };
    const node = (
        <div onClick={() => onClick(parent)}>
            {nodeFormatter(parent, [...path, nodeKey(parent.data)])}
        </div>
    );
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
                return prefixEntryFormatter(parent.data);
            case PrefixType.Leaf:
                return prefixLeafFormatter(parent.data);
            case PrefixType.EmptySpacer:
                return prefixEmptySpacerFormatter(parent.data);
            case PrefixType.NestedSpacer:
                return prefixNestedSpacerFormatter(parent.data);
            default:
                let unhandled: never = type;
                console.log(`Unknown prefix type: "${type}"`);

                return null;
        }
    });

    treeNodes.push(
        <div style={{ display: `flex` }}>
            {allPrefixes}
            {node}
        </div>
    );

    for (const [i, child] of parent.children.entries()) {
        treeNodes.push(
            ...visit(
                child,
                i,
                parent.children.length,
                [...prefixes],
                [...path, nodeKey(parent.data)],
                treeFormatter,
                treeUtility
            )
        );
    }

    return treeNodes;
}

export const TreeTest: React.FC = () => {
    const nodeFormatter = (node: ITreeNode<ITestNode>, path: string[]) => (
        <span onClick={() => console.log(node.data.label, path, node.active)}>
            {node.data.label} {node.active ? `active` : `not active`}
        </span>
    );
    const nodeKey = (node: ITestNode) => node.label;
    const prefixEntryFormatter = (node: ITestNode): JSX.Element => {
        return <span>├</span>;
    };
    const prefixLeafFormatter = (node: ITestNode): JSX.Element => {
        return <span>└</span>;
    };
    const prefixEmptySpacerFormatter = (node: ITestNode): JSX.Element => {
        return <span> </span>;
    };
    const prefixNestedSpacerFormatter = (node: ITestNode): JSX.Element => {
        return <span>│</span>;
    };
    const treeFormatter: ITreeFormatter<ITestNode> = {
        nodeFormatter,
        nodeKey,
        prefixEntryFormatter,
        prefixLeafFormatter,
        prefixEmptySpacerFormatter,
        prefixNestedSpacerFormatter
    };

    return <Tree treeFormatter={treeFormatter} root={nodes} />;
};
