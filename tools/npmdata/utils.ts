export interface IDependencyTreeConfig {
    data: TreeData[];
    tree: IDependencyTree;
}

export interface ITreeData {
    name: string;
    version: string;
    count: number;
}
export type TreeData = [id: string, data: ITreeData];

export interface IDependencyTree {
    id: string;
    dependencies?: IDependencyTree[];
}
