import * as React from 'react';
import { ComponentProvider } from '@microsoft/micro-frontend/lib/ComponentProvider';
import { ReduxComponentProviderExtension } from '@microsoft/micro-frontend-redux/lib/ReduxComponentProviderExtension';

export function Home(): React.ReactElement {
  return (
    <>
      <ComponentProvider
        config={{
          script: 'http://localhost:8000/bundles/micro-frontend-app.js',
          name: 'MicroFrontendApp',
        }}
        extension={ReduxComponentProviderExtension}
      />
    </>
  );
}
