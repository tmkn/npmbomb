export interface IDependencyTreeConfig {
    data: TreeLookupData[];
    tree: IDependencyTreeStructure;
}

export interface ITreeData {
    name: string;
    version: string;
    count: number;
}
export type TreeLookupData = [id: string, data: ITreeData];

export interface IDependencyTreeStructure {
    id: string;
    dependencies?: IDependencyTreeStructure[];
}
