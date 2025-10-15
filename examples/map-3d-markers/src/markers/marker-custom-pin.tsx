import React, {FunctionComponent, useRef, useEffect} from 'react';

interface Props {
  markerOptions: google.maps.maps3d.Marker3DElementOptions;
  pinOptions?: google.maps.marker.PinElementOptions;
}

const MarkerCustomPin: FunctionComponent<Props> = ({
  markerOptions,
  pinOptions
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (parent) {
      const marker = new google.maps.maps3d.Marker3DElement(markerOptions);

      if (pinOptions) {
        const pin = new google.maps.marker.PinElement({
          ...pinOptions,
          glyph: pinOptions.glyph
            ? new URL(pinOptions.glyph as string)
            : undefined
        });
        marker.append(pin);
      }
      parent.appendChild(marker);
    }
  }, [markerOptions, pinOptions]);

  return <div ref={ref} />;
};

export default MarkerCustomPin;
