import React, {memo} from 'react';
import {Feature, Point} from 'geojson';
import {CastleFeatureProps} from '../castles';

type InfowindowContentProps = {
  features: Feature<Point>[];
};

const numFmt = new Intl.NumberFormat();

export const InfoWindowContent = memo(({features}: InfowindowContentProps) => {
  if (features.length === 1) {
    const f = features[0];
    const props = f.properties! as CastleFeatureProps;

    return (
      <div>
        <h4>{props.name}</h4>
        <p>
          <a href={getDetailsUrl(props)} target="_blank">
            more information
          </a>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h4>{numFmt.format(features.length)} features. Zoom in to explore.</h4>

      <ul>
        {features.slice(0, 5).map(feature => {
          const props = feature.properties! as CastleFeatureProps;

          return (
            <li key={feature.id}>
              <a href={getDetailsUrl(props)} target="_blank">
                {props.name}
              </a>
            </li>
          );
        })}

        {features.length > 5 && (
          <li>and {numFmt.format(features.length - 5)} more.</li>
        )}
      </ul>
    </div>
  );
});

function getDetailsUrl(props: CastleFeatureProps) {
  return props.wikipedia
    ? getWikipediaUrl(props.wikipedia)
    : getWikidataUrl(props.wikidata);
}
function getWikipediaUrl(contentId: string) {
  const [lang, title] = contentId.split(':');

  return `https://${lang}.wikipedia.org/wiki/${title.replace(/ /g, '_')}`;
}
function getWikidataUrl(id: string) {
  return `https://www.wikidata.org/wiki/${id}`;
}
