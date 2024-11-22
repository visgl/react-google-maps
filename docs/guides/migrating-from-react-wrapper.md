# Migrating from `@googlemaps/react-wrapper`

The [`@googlemaps/react-wrapper`][npm-react-wrapper] library provides a 
minimal wrapper for loading the Maps JavaScript API in a React Application.

If you decide to migrate from using `@googlemaps/react-wrapper` to this
library, this can be done seamlessly by using a poyfill for the `<Wrapper>`
component.

Roughly speaking, our [`<APIProvider>`][rgm-api-provider] component has the
same function as the `<Wrapper>` component provided by
`@googlemaps/react-wrapper`, with one major difference: While the `Wrapper`
component will only render its children once the Google Maps JavaScript API
has been loaded, the `APIProvider` will always render the children and use
custom hooks like [`useApiLoadingStatus()`][rgm-use-api-loading-status] to
handle API loading in its components.

The following code shows how the `Wrapper` component can be implemented with
this library in a fully compatible way, allowing you to use it as a
drop-in-replacement for the `@googlemaps/react-wrapper` library.

[A complete example can be found here][rgm-examples-react-wrapper-migration].

```tsx title="wrapper.tsx"
import React, {
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
  useEffect
} from 'react';

import {
  APILoadingStatus,
  APIProvider,
  APIProviderProps,
  useApiLoadingStatus
} from '@vis.gl/react-google-maps';

const STATUS_MAP = {
  [APILoadingStatus.LOADING]: 'LOADING',
  [APILoadingStatus.LOADED]: 'SUCCESS',
  [APILoadingStatus.FAILED]: 'FAILURE'
} as const;

type WrapperProps = PropsWithChildren<
  {
    apiKey: string;
    callback?: (status: string) => void;
    render?: (status: string) => ReactNode;
  } & APIProviderProps
>;

export const Wrapper: FunctionComponent<WrapperProps> = ({
  apiKey,
  children,
  render,
  callback,
  ...apiProps
}) => {
  return (
    <APIProvider apiKey={apiKey} {...apiProps}>
      <InnerWrapper render={render}>{children}</InnerWrapper>
    </APIProvider>
  );
};

const InnerWrapper = ({
  callback,
  render,
  children
}: PropsWithChildren<Omit<WrapperProps, 'apiKey'>>) => {
  const status = useApiLoadingStatus();
  const mappedStatus = STATUS_MAP[status] ?? 'LOADING';

  useEffect(() => {
    if (callback) callback(mappedStatus);
  }, [callback, mappedStatus]);

  if (status === APILoadingStatus.LOADED) return children;
  if (render) return render(mappedStatus);

  return <></>;
};
```

[npm-react-wrapper]: https://www.npmjs.com/package/@googlemaps/react-wrapper
[rgm-api-provider]: ../api-reference/components/api-provider.md
[rgm-use-api-loading-status]: ../api-reference/hooks/use-api-loading-status.md
[rgm-examples-react-wrapper-migration]: https://github.com/visgl/react-google-maps/tree/main/examples/react-wrapper-migration
