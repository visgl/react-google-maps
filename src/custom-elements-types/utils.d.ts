import type React from 'react';

export type CustomElement<
  P,
  E extends HTMLElement = HTMLElement
> = React.DetailedHTMLProps<React.HTMLAttributes<E>, E> & P;

export {};
