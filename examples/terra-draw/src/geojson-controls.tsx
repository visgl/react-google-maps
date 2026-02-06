import * as React from 'react';
import type {TerraDraw} from 'terra-draw';

type GeoJsonControlsProps = {
  draw: TerraDraw | null;
};

const GeoJsonControls = ({draw}: GeoJsonControlsProps) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleExport = () => {
    if (!draw) return;

    // TerraDraw snapshots are already GeoJSON features, so we wrap them in a FeatureCollection.
    const geojson = {
      type: 'FeatureCollection',
      features: draw.getSnapshot()
    };

    const data = JSON.stringify(geojson, null, 2);
    const blob = new Blob([data], {type: 'application/json'});
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'terra-draw.geojson';
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange: React.ChangeEventHandler<
    HTMLInputElement
  > = event => {
    if (!draw) return;

    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const geojson = JSON.parse(e.target?.result as string);
        // Keep the example strict for clarity: only FeatureCollection inputs.
        if (geojson?.type === 'FeatureCollection') {
          draw.addFeatures(geojson.features ?? []);
        } else {
          alert('Invalid GeoJSON: expected FeatureCollection.');
        }
      } catch (error) {
        alert('Unable to parse GeoJSON file.');
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="terra-draw-toolbar-group">
      <div className="terra-draw-toolbar-row">
        <button
          type="button"
          className="terra-draw-button"
          onClick={handleExport}
          disabled={!draw}>
          Export GeoJSON
        </button>
        <button
          type="button"
          className="terra-draw-button"
          onClick={handleUploadClick}
          disabled={!draw}>
          Import GeoJSON
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="application/geo+json,application/json,.geojson"
        className="terra-draw-file-input"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default React.memo(GeoJsonControls);
