import type {DetailedHTMLProps, HTMLAttributes} from 'react';
import type {GmpWritableElement} from '../../types/writable';

export type ReactIntrinsicElementBridge<Element, EventMap, ReactProps> = {
  [K in keyof EventMap as `on${string & K}`]?: (event: EventMap[K]) => void;
} & Omit<GmpWritableElement<Element>, keyof ReactProps> &
  ReactProps;

export type ReactIntrinsicElementBridgeMap<
  ElementTagNameMap,
  ElementEventMapByTagName extends Record<keyof ElementTagNameMap, unknown>
> = {
  [K in keyof ElementTagNameMap]: ReactIntrinsicElementBridge<
    ElementTagNameMap[K],
    ElementEventMapByTagName[K],
    DetailedHTMLProps<
      HTMLAttributes<ElementTagNameMap[K]>,
      ElementTagNameMap[K]
    >
  >;
};

declare module 'react' {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface IntrinsicElements extends ReactIntrinsicElementBridgeMap<
      google.maps.HTMLElementTagNameMap,
      google.maps.HTMLElementEventMapTagNameMap
    > {}
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface CSSProperties extends google.maps.CSSProperties {}
}
