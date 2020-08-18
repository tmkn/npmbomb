import React from "react";
import { render, fireEvent } from "@testing-library/react";

import { Tree, ITreeNodeData, ITreeFormatter } from "./Tree";
import { IDependencyTreeData } from "../../package/Package";

describe("<Tree />", () => {
    beforeEach(() => {
        //needed by react-virtualized for rendering the list
        jest.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(300);
        jest.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(300);
    });

    test("correctly triggers onClick", async () => {
        const root: ITreeNodeData<IDependencyTreeData> = {
            active: false,
            canExpand: false,
            expanded: false,
            children: [],
            data: {
                c: 13,
                d: [],
                n: `foo`,
                v: `1`
            }
        };
        const callbackMock = jest.fn();
        const treeFormatter: ITreeFormatter<IDependencyTreeData> = {
            nodeFormatter: (node, path, options, onClick) => {
                return (
                    <div
                        onClick={() => onClick(callbackMock)}
                    >{`${node.data.n}@${node.data.v}`}</div>
                );
            },
            prefixEmptySpacerFormatter: () => <div></div>,
            prefixEntryFormatter: () => <div></div>,
            prefixLeafFormatter: () => <div></div>,
            prefixNestedSpacerFormatter: () => <div></div>,
            nodeKey: node => node.n
        };
        const equal = (node: ITreeNodeData<IDependencyTreeData>) => node.data.n;

        const { findByText } = render(
            <Tree root={root} treeFormatter={treeFormatter} equal={equal} />
        );
        const el = await findByText(`foo@1`);

        fireEvent.click(el);
        expect(callbackMock).toHaveBeenCalledTimes(1);
    });
});
