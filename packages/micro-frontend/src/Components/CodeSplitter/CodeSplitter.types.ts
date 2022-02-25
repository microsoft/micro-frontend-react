export interface ICodeSplitterProps<T> {
    name: string;
    import(): Promise<{ [key: string]: React.ComponentType<T> }>;
    props?: T;
}

export interface ICodeSplitterState<T> {
    Component: React.ComponentType<T> | null;
}
