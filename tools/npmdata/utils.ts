export interface IDependencyTreeConfig {
    data: ITreeData[];
    tree: IDependencyTreeStructure;
}

export interface ITreeData {
    id: number;
    name: string;
    version: string;
    count: number;
}
//export type TreeLookupData = [id: string, data: ITreeData];

export interface IDependencyTreeStructure {
    id: number;
    dependencies?: IDependencyTreeStructure[];
}
