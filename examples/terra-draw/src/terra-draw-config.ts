import {
  TerraDrawCircleMode,
  TerraDrawFreehandMode,
  TerraDrawLineStringMode,
  TerraDrawPointMode,
  TerraDrawPolygonMode,
  TerraDrawRectangleMode,
  TerraDrawSelectMode
} from 'terra-draw';

export type TerraDrawModeId =
  | 'select'
  | 'point'
  | 'linestring'
  | 'polygon'
  | 'rectangle'
  | 'circle'
  | 'freehand'
  | 'static';

export const DRAWING_MODE_BUTTONS: Array<{id: TerraDrawModeId; label: string}> =
  [
    {id: 'select', label: 'Select'},
    {id: 'point', label: 'Point'},
    {id: 'linestring', label: 'Line'},
    {id: 'polygon', label: 'Polygon'},
    {id: 'rectangle', label: 'Rectangle'},
    {id: 'circle', label: 'Circle'},
    {id: 'freehand', label: 'Freehand'}
  ];

// Colors are randomized per feature to make edits visually distinct.
const COLOR_PALETTE = [
  '#E74C3C',
  '#FF0066',
  '#9B59B6',
  '#673AB7',
  '#3F51B5',
  '#3498DB',
  '#03A9F4',
  '#00BCD4',
  '#009688',
  '#27AE60',
  '#8BC34A',
  '#CDDC39',
  '#F1C40F',
  '#FFC107',
  '#F39C12',
  '#FF5722',
  '#795548'
];

const getRandomColor = () =>
  COLOR_PALETTE[
    Math.floor(Math.random() * COLOR_PALETTE.length)
  ] as `#${string}`;

const createPolygonStyles = () => {
  const color = getRandomColor();
  return {fillColor: color, outlineColor: color};
};

const createLineStringStyles = () => ({
  lineStringColor: getRandomColor()
});

const createPointStyles = () => ({
  pointColor: getRandomColor()
});

// Selection flags control drag/rotate/vertex editing in Select mode.
const createSelectionFlags = () => ({
  feature: {
    draggable: true,
    rotateable: true,
    coordinates: {
      midpoints: true,
      draggable: true,
      deletable: true
    }
  }
});

// Centralized mode factory to keep UI and TerraDraw configuration in sync.
export const createTerraDrawModes = () => [
  new TerraDrawSelectMode({
    flags: {
      polygon: createSelectionFlags(),
      linestring: createSelectionFlags(),
      rectangle: createSelectionFlags(),
      circle: createSelectionFlags(),
      freehand: createSelectionFlags(),
      point: {
        feature: {
          draggable: true,
          rotateable: true
        }
      }
    }
  }),
  new TerraDrawPointMode({
    editable: true,
    styles: createPointStyles()
  }),
  new TerraDrawLineStringMode({
    editable: true,
    styles: createLineStringStyles()
  }),
  new TerraDrawPolygonMode({
    editable: true,
    styles: createPolygonStyles()
  }),
  new TerraDrawRectangleMode({
    styles: createPolygonStyles()
  }),
  new TerraDrawCircleMode({
    styles: createPolygonStyles()
  }),
  new TerraDrawFreehandMode({
    styles: createPolygonStyles()
  })
];
