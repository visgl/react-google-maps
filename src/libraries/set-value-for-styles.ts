/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * The code in this file was adapted from the internal react-dom-bindings package.
 * https://github.com/facebook/react/tree/4508873393058e86bed308b56e49ec883ece59d1/packages/react-dom-bindings
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {CSSProperties} from 'react';

export function setValueForStyles(
  element: HTMLElement,
  styles: CSSProperties | null,
  prevStyles: CSSProperties | null
) {
  if (styles != null && typeof styles !== 'object') {
    throw new Error(
      'The `style` prop expects a mapping from style properties to values, ' +
        "not a string. For example, style={{marginRight: spacing + 'em'}} when " +
        'using JSX.'
    );
  }

  const elementStyle = element.style;

  // without `prevStyles`, just set all values
  if (prevStyles == null) {
    if (styles == null) return;

    for (const styleName in styles) {
      if (!styles.hasOwnProperty(styleName)) continue;

      setValueForStyle(
        elementStyle,
        styleName,
        styles[styleName as keyof CSSProperties]
      );
    }

    return;
  }

  // unset all styles in `prevStyles` that aren't in `styles`
  for (const styleName in prevStyles) {
    if (
      prevStyles.hasOwnProperty(styleName) &&
      (styles == null || !styles.hasOwnProperty(styleName))
    ) {
      // Clear style
      const isCustomProperty = styleName.indexOf('--') === 0;
      if (isCustomProperty) {
        elementStyle.setProperty(styleName, '');
      } else if (styleName === 'float') {
        elementStyle.cssFloat = '';
      } else {
        elementStyle[styleName as any] = '';
      }
    }
  }

  // only assign values from `styles` that are different from `prevStyles`
  if (styles == null) return;

  for (const styleName in styles) {
    const value = styles[styleName as keyof CSSProperties];
    if (
      styles.hasOwnProperty(styleName) &&
      prevStyles[styleName as keyof CSSProperties] !== value
    ) {
      setValueForStyle(elementStyle, styleName, value);
    }
  }
}

function setValueForStyle(
  elementStyle: CSSStyleDeclaration,
  styleName: string,
  value: unknown
) {
  const isCustomProperty = styleName.indexOf('--') === 0;

  // falsy values will unset the style property
  if (value == null || typeof value === 'boolean' || value === '') {
    if (isCustomProperty) {
      elementStyle.setProperty(styleName, '');
    } else if (styleName === 'float') {
      elementStyle.cssFloat = '';
    } else {
      elementStyle[styleName as any] = '';
    }
  }

  // custom properties can't be directly assigned
  else if (isCustomProperty) {
    elementStyle.setProperty(styleName, value as string);
  }

  // numeric values are treated as 'px' unless the style property expects unitless numbers
  else if (
    typeof value === 'number' &&
    value !== 0 &&
    !isUnitlessNumber(styleName)
  ) {
    elementStyle[styleName as any] = value + 'px'; // Presumes implicit 'px' suffix for unitless numbers
  }

  // everything else can just be assigned
  else {
    if (styleName === 'float') {
      elementStyle.cssFloat = value as string;
    } else {
      elementStyle[styleName as any] = ('' + value).trim();
    }
  }
}

// CSS properties which accept numbers but are not in units of "px".
const unitlessNumbers = new Set([
  'animationIterationCount',
  'aspectRatio',
  'borderImageOutset',
  'borderImageSlice',
  'borderImageWidth',
  'boxFlex',
  'boxFlexGroup',
  'boxOrdinalGroup',
  'columnCount',
  'columns',
  'flex',
  'flexGrow',
  'flexPositive',
  'flexShrink',
  'flexNegative',
  'flexOrder',
  'gridArea',
  'gridRow',
  'gridRowEnd',
  'gridRowSpan',
  'gridRowStart',
  'gridColumn',
  'gridColumnEnd',
  'gridColumnSpan',
  'gridColumnStart',
  'fontWeight',
  'lineClamp',
  'lineHeight',
  'opacity',
  'order',
  'orphans',
  'scale',
  'tabSize',
  'widows',
  'zIndex',
  'zoom',
  'fillOpacity', // SVG-related properties
  'floodOpacity',
  'stopOpacity',
  'strokeDasharray',
  'strokeDashoffset',
  'strokeMiterlimit',
  'strokeOpacity',
  'strokeWidth'
]);
function isUnitlessNumber(name: string): boolean {
  return unitlessNumbers.has(name);
}
