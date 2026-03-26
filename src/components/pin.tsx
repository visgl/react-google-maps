import React, {FunctionComponent, PropsWithChildren, useMemo} from 'react';
import {useMapsLibrary} from '../hooks/use-maps-library';
import {PinLegacy} from './pin-legacy';
import {PinModern} from './pin-modern';

/**
 * Props for the Pin component
 */
export type PinProps = PropsWithChildren<google.maps.marker.PinElementOptions>;

/**
 * Component to configure the appearance of an AdvancedMarker or Marker3D.
 *
 * Automatically detects the Maps API version and uses the appropriate implementation:
 * - Legacy implementation (< 3.62): Uses the original PinElement API with glyph property
 * - Modern implementation (≥ 3.62): Uses the new custom element API with glyphSrc/glyphText
 *
 * @example
 * ```tsx
 * // Basic usage
 * <AdvancedMarker position={{lat: 0, lng: 0}}>
 *   <Pin background="#FF0000" glyphColor="#FFFFFF" />
 * </AdvancedMarker>
 *
 * // With custom glyph (legacy)
 * <Pin glyph="📍" />
 *
 * // With custom glyph (modern, recommended for Maps API 3.62+)
 * <Pin glyphText="📍" />
 * <Pin glyphSrc="https://example.com/icon.png" />
 *
 * // With React children as glyph
 * <Pin>
 *   <CustomIcon />
 * </Pin>
 * ```
 */
export const Pin: FunctionComponent<PinProps> = props => {
  const markerLibrary = useMapsLibrary('marker');

  // Detect capability after the marker library is loaded
  const isModern = useMemo(() => {
    if (!markerLibrary) return false;

    // Check if <gmp-pin> custom element exists
    // This happens while loading the marker library in Maps API 3.62+
    return (
      typeof customElements !== 'undefined' &&
      customElements.get('gmp-pin') !== undefined
    );
  }, [markerLibrary]);

  // Wait for marker library to load before rendering
  if (!markerLibrary) return null;

  // Map props based on which implementation we're using
  if (isModern) {
    // Modern: map old glyph prop to new glyphSrc/glyphText
    const {glyph, glyphSrc, glyphText, ...restProps} = props;
    const isUrl =
      glyph instanceof URL ||
      (typeof glyph === 'string' && glyph.startsWith('http'));
    const finalGlyphText =
      glyphText ?? (typeof glyph === 'string' && !isUrl ? glyph : undefined);
    const finalGlyphSrc = glyphSrc ?? (isUrl ? String(glyph) : undefined);

    return (
      <PinModern
        {...restProps}
        glyphText={finalGlyphText}
        glyphSrc={finalGlyphSrc}
      />
    );
  } else {
    // Legacy: map new glyphSrc/glyphText to old glyph prop
    const {glyph, glyphSrc, glyphText, ...restProps} = props;
    const finalGlyph = glyph ?? glyphSrc ?? glyphText;

    return <PinLegacy {...restProps} glyph={finalGlyph} />;
  }
};
