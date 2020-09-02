//todo move content to DependencyTree.tsx?

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

export interface IDependencyTreeStructure {
    id: number;
    dependencies?: IDependencyTreeStructure[];
}
