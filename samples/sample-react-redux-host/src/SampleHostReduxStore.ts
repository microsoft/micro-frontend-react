export type HostState = {
  hostAppName: string;
};

const initialState: HostState = {
  hostAppName: __APP_NAME__,
};

export function hostReducer(prev: HostState = initialState, action: { type: string }) {
  switch (action.type) {
    default:
      return prev;
  }
}
