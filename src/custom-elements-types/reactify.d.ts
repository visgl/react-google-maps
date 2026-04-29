import type {DetailedHTMLProps, HTMLAttributes} from 'react';
import type {GmpWritableElement} from '../../types/writable';

type Reactify<Element, EventMap, ReactProps> = {
  [K in keyof EventMap as `on${string & K}`]?: (event: EventMap[K]) => void;
} & Omit<GmpWritableElement<Element>, keyof ReactProps> &
  ReactProps;

type MergedForReact<
  HTMLElementTagNameMap,
  HTMLElementEventMapTagNameMap extends Record<
    keyof HTMLElementTagNameMap,
    unknown
  >
> = {
  [K in keyof HTMLElementTagNameMap]: Reactify<
    HTMLElementTagNameMap[K],
    HTMLElementEventMapTagNameMap[K],
    DetailedHTMLProps<
      HTMLAttributes<HTMLElementTagNameMap[K]>,
      HTMLElementTagNameMap[K]
    >
  >;
};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements extends MergedForReact<
      google.maps.HTMLElementTagNameMap,
      google.maps.HTMLElementEventMapTagNameMap
    > {}
  }
  interface CSSProperties extends google.maps.CSSProperties {}
}
