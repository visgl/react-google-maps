import React, {FunctionComponent, useEffect, useRef} from 'react';

interface Props {
  markerOptions: google.maps.maps3d.Marker3DElementOptions;
  url: URL;
}

const Model3D: FunctionComponent<Props> = ({markerOptions, url}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (parent) {
      const model3dElement = new google.maps.maps3d.Model3DElement({
        src: url,
        orientation: {heading: 0, tilt: 0, roll: 0},
        scale: 10,
        ...markerOptions
      });

      parent.appendChild(model3dElement);
    }
  });

  return <div ref={ref} />;
};

export default Model3D;
