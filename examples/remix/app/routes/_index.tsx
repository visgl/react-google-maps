import {ClientOnly} from 'remix-utils/client-only';

import MyMap from '../components/map/map.client';
import MyMapFallback from '../components/map/map-fallback';

export default function Index() {
  return (
    <ClientOnly fallback={<MyMapFallback />}>{() => <MyMap />}</ClientOnly>
  );
}
