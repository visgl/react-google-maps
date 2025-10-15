import {useMapsLibrary} from '@vis.gl/react-google-maps';
import React, {memo, useEffect, useRef} from 'react';

type ReferenceMarkerProps = {
  markerOptions: google.maps.maps3d.Marker3DElementOptions;
  onClick: () => void;
};

export const PlaceMarker = memo((props: ReferenceMarkerProps) => {
  const markerLib = useMapsLibrary('marker');

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!markerLib) return;

    const parent = ref.current?.parentElement;
    let marker: google.maps.maps3d.Marker3DInteractiveElement | null = null;
    if (parent) {
      marker = new google.maps.maps3d.Marker3DInteractiveElement(
        props.markerOptions
      );

      const pin = new markerLib.PinElement({
        background: '#f29900',
        glyphColor: '#fff',
        borderColor: '#0006'
      });

      marker.append(pin);

      marker.addEventListener('gmp-click', props.onClick);

      parent.appendChild(marker);
    }

    return () => {
      if (marker) {
        marker.remove();
      }
    };
  }, [markerLib]);

  return <div ref={ref} />;
});
