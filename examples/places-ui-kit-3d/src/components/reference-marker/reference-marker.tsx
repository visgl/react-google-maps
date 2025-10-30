import React, {memo, useEffect, useRef} from 'react';

type ReferenceMarkerProps = {
  markerOptions: google.maps.maps3d.Marker3DElementOptions;
  onClick: () => void;
};

const ReferenceMarkerComponent = (props: ReferenceMarkerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (parent) {
      const marker = new google.maps.maps3d.Marker3DInteractiveElement(
        props.markerOptions
      );

      const img = document.createElement('img');
      img.src = new URL(
        '../reference-marker/hotel_icon.svg',
        import.meta.url
      ).toString();

      const template = document.createElement('template');
      template.content.append(img);

      marker.append(template);
      marker.addEventListener('gmp-click', props.onClick);

      parent.appendChild(marker);
    }
  });

  return <div ref={ref} />;
};
ReferenceMarkerComponent.displayName = 'ReferenceMarker';

export const ReferenceMarker = memo(ReferenceMarkerComponent);
