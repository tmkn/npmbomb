import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";

import {
    Tree,
    ITreeNodeData,
    ITreeFormatter,
    Breadcrumbs,
    BreadcrumbsContext,
    IBreadcrumbsContext
} from "./Tree";
import { IDependencyTreeNodeData } from "../../package/DependencyTree";

describe("<Tree />", () => {
    beforeEach(() => {
        //needed by react-virtualized for rendering the list
        jest.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(300);
        jest.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(300);

        window.HTMLElement.prototype.scrollIntoView = jest.fn();
    });

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

    test("correctly triggers onClick", async () => {
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

    test("correctly shows breadcrumbs on hover", async () => {
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
        const equal = (node: ITreeNodeData<IDependencyTreeNodeData>) =>
            `${node.data.name}@${node.data.version}`;

        const { findByText, findByTestId } = render(
            <Tree keyFn={equal} root={root} treeFormatter={treeFormatter} />
        );
        const el = await findByText(`foo@1`);

        fireEvent.mouseOver(el);
        const breadcrumb = await findByTestId(`crumb_foo@1`);
    });

    test("correctly display single breadcrumb", async () => {
        const context: IBreadcrumbsContext = {
            breadcrumbs: [`test breadcrumb`]
        };
        const { findByText, container } = render(
            <BreadcrumbsContext.Provider value={context}>
                <Breadcrumbs />
            </BreadcrumbsContext.Provider>
        );

        await findByText(`test breadcrumb`);
        const spacer = await waitFor(() => container.querySelectorAll<HTMLSpanElement>(".codicon"));
        expect(spacer.length).toBe(0);
    });

    test("correctly display multiple breadcrumbs", async () => {
        const context: IBreadcrumbsContext = {
            breadcrumbs: [`breadcrumb1`, `breadcrumb2`, `breadcrumb3`]
        };
        const { findByText, container } = render(
            <BreadcrumbsContext.Provider value={context}>
                <Breadcrumbs />
            </BreadcrumbsContext.Provider>
        );

        for (const crumb of context.breadcrumbs) await findByText(crumb);

        const spacer = await waitFor(() => container.querySelectorAll<HTMLSpanElement>(".codicon"));
        expect(spacer.length).toBe(context.breadcrumbs.length - 1);
    });
});
