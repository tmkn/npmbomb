import React from "react";
import { render, fireEvent } from "@testing-library/react";

import { Tree, ITreeNodeData, ITreeFormatter } from "./Tree";
import { IDependencyTreeNodeData } from "../../package/Package";

describe("<Tree />", () => {
    beforeEach(() => {
        //needed by react-virtualized for rendering the list
        jest.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(300);
        jest.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(300);
    });

    test("correctly triggers onClick", async () => {
        const root: ITreeNodeData<IDependencyTreeNodeData> = {
            active: false,
            canExpand: false,
            expanded: false,
            children: [],
            data: {
                id: 0,
                count: 13,
                dependencies: [],
                name: `foo`,
                version: `1`
            }
        };
        const callbackMock = jest.fn();
        const treeFormatter: ITreeFormatter<IDependencyTreeNodeData> = {
            nodeFormatter: (node, path, options, onClick) => {
                return (
                    <div
                        onClick={() => onClick(callbackMock)}
                    >{`${node.data.name}@${node.data.version}`}</div>
                );
            },
            prefixEmptySpacerFormatter: () => <div></div>,
            prefixEntryFormatter: () => <div></div>,
            prefixLeafFormatter: () => <div></div>,
            prefixNestedSpacerFormatter: () => <div></div>,
            nodeKey: node => node.name
        };
        const equal = (node: ITreeNodeData<IDependencyTreeNodeData>) => node.data.name;

        const { findByText } = render(
            <Tree keyFn={equal} root={root} treeFormatter={treeFormatter} />
        );
        const el = await findByText(`foo@1`);

        fireEvent.click(el);
        expect(callbackMock).toHaveBeenCalledTimes(1);
    });
});
