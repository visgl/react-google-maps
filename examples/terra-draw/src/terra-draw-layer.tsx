import * as React from 'react';

import {useTerraDraw} from './use-terra-draw';

type TerraDrawLayerProps = {
  children: (draw: ReturnType<typeof useTerraDraw>) => React.ReactNode;
};

const TerraDrawLayer = ({children}: TerraDrawLayerProps) => {
  const draw = useTerraDraw();

  return <>{children(draw)}</>;
};

export default React.memo(TerraDrawLayer);
