import * as React from 'react';
import { ICodeSplitterProps, ICodeSplitterState } from './CodeSplitter.types';

export class CodeSplitter<T> extends React.Component<
    ICodeSplitterProps<T>,
    ICodeSplitterState<T>
> {
    public state: ICodeSplitterState<T> = {
        Component: null,
    };

    public async componentDidMount(): Promise<void> {
        const { import: asyncImport, name } = this.props;

        const result = await asyncImport();
        this.setState({
            Component: result[name],
        });
    }

    public render(): JSX.Element | null {
        const { props } = this.props;
        const { Component } = this.state;
        if (!Component) return null;

        return <Component {...(props as T)} />;
    }
}
