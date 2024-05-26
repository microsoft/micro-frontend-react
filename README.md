# Micro-Frontend!

This is an open source library that shares a set of utilities that can be used to support Micro-Frontend architecture in your React.js applications.

While the proper documentation is being prepared, please see the following samples:

## React.js

* [Host application](https://github.com/microsoft/microfrontend/blob/main/samples/sample-react-host/src/App.tsx)
  * The host application provides shared "Context"
  * The host application loads Micro-Frontend applications using or `ComponentProvider` with runtime configuration
    ``` tsx
    // Load a micro-frontend anywhere on the screen
    <ComponentProvider
      config={{
        script: 'http://localhost:8000/bundles/micro-frontend-app.js',
        name: 'MicroFrontendApp',
      }}
    />
    ```
* [Micro-Frontend application](https://github.com/microsoft/microfrontend/blob/main/samples/sample-react-micro-frontend/src/MicroFrontendApp.tsx)
  * Micro-Frontends are components that are developed and deployed in isolation
  * Micro-Frontends will receive the "Context" when mounted

## React.js with Redux
* [Host application with Redux](https://github.com/microsoft/micro-frontend/blob/main/samples/sample-react-redux-host/src/App.tsx)
  * Setup host application with various redux extensions such as redux-sagas, redux-logger, redux-persist
  * Host's "Context" now includes utilities for Redux operations
* [Micro-Frontend application with Redux](https://github.com/microsoft/micro-frontend/blob/main/samples/sample-react-redux-micro-frontend/src/MicroFrontendApp.tsx)
  * Retrieve data from host application's Redux store
  * Register new reducer and saga to the host application's Redux store

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft 
trademarks or logos is subject to and must follow 
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
