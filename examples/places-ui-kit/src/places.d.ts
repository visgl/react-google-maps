export type CSSWithCustomProperties = React.CSSProperties & {
  [key: `--${string}`]: string | number;
};
