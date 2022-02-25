import * as React from 'react';
import { ReduxContext } from '../Contexts/ReduxContext';
import { ReactReduxContext } from 'react-redux';

type ConnectProps = { context?: typeof ReactReduxContext };

// eslint-disable-next-line @typescript-eslint/ban-types
export function withReduxContext<T extends {}>(
    WrappedComponent: React.ComponentType<T & ConnectProps>
): React.ComponentType<T & ConnectProps> {
    const ComponentWithContext: React.ComponentType<T & ConnectProps> = (
        props: T & ConnectProps
    ): React.ReactElement => {
        return (
            <ReduxContext.Consumer>
                {({ __redux_context__ }): React.ReactElement => (
                    <WrappedComponent context={__redux_context__} {...props} />
                )}
            </ReduxContext.Consumer>
        );
    };

    return ComponentWithContext;
}
