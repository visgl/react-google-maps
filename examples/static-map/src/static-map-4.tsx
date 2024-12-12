import React from 'react';
import {StaticMap, createStaticMapsUrl} from '@vis.gl/react-google-maps';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

export default function StaticMap4() {
  const staticMapsUrl = createStaticMapsUrl({
    apiKey: API_KEY,
    scale: 2,
    width: 600,
    height: 600,
    paths: [
      {
        color: '0xff00ff',
        fillcolor: '0xffff00',
        coordinates:
          'enc:}zswFtikbMjJzZ|RdPfZ}DxWvBjWpF~IvJnEvBrMvIvUpGtQpFhOQdKpz@bIx{A|PfYlvApz@bl@tcAdTpGpVwQtX}i@|Gen@lCeAda@bjA`q@v}@rfAbjA|EwBpbAd_@he@hDbu@uIzWcWtZoTdImTdIwu@tDaOXw_@fc@st@~VgQ|[uPzNtA`LlEvHiYyLs^nPhCpG}SzCNwHpz@cEvXg@bWdG`]lL~MdTmEnCwJ[iJhOae@nCm[`Aq]qE_pAaNiyBuDurAuB}}Ay`@|EKv_@?|[qGji@lAhYyH`@Xiw@tBerAs@q]jHohAYkSmW?aNoaAbR}LnPqNtMtIbRyRuDef@eT_z@mW_Nm|B~j@zC~hAyUyJ_U{Z??cPvg@}s@sHsc@_z@cj@kp@YePoNyYyb@_iAyb@gBw^bOokArcA}GwJuzBre@i\\tf@sZnd@oElb@hStW{]vv@??kz@~vAcj@zKa`Atf@uQj_Aee@pU_UrcA'
      }
    ],
    style: [
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{color: '#00ff00'}]
      },
      {
        featureType: 'landscape',
        elementType: 'geometry.fill',
        stylers: [{color: '#222222'}]
      },
      {
        elementType: 'labels',
        stylers: [{invert_lightness: true}]
      },
      {
        featureType: 'road.arterial',
        elementType: 'labels',
        stylers: [{invert_lightness: false}]
      }
    ]
  });

  return <StaticMap className="map" url={staticMapsUrl} />;
}
