export type CSSWithCustomProperties = React.CSSProperties & {
  [key: `--${string}`]: string | number;
};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'gmp-place-details': {
        style?: CSSWithCustomProperties;
      };
      'gmp-place-details-compact': {
        style?: CSSWithCustomProperties;
      };
      'gmp-place-search': {
        style?: CSSWithCustomProperties;
      };
    }
  }
}