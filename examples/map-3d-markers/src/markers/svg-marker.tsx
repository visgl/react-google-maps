import React, {FunctionComponent, useEffect, useRef} from 'react';

interface Props {
  markerOptions: google.maps.maps3d.Marker3DElementOptions;
  svgUrl: string;
}

const SvgMarker: FunctionComponent<Props> = ({markerOptions, svgUrl}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (parent) {
      const marker = new google.maps.maps3d.Marker3DElement(markerOptions);

      const img = document.createElement('img');
      img.src = svgUrl;

      const template = document.createElement('template');
      template.content.append(img);

      marker.append(template);
      parent.appendChild(marker);
    }
  });

  return <div ref={ref} />;
};

export default SvgMarker;
