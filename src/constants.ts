/**
 * Copy of the `google.maps.CollisionBehavior` constants.
 * They have to be duplicated here since we can't wait for the maps API to load
 * to be able to use them.
 */
export const CollisionBehavior = {
  REQUIRED: 'REQUIRED',
  REQUIRED_AND_HIDES_OPTIONAL: 'REQUIRED_AND_HIDES_OPTIONAL',
  OPTIONAL_AND_HIDES_LOWER_PRIORITY: 'OPTIONAL_AND_HIDES_LOWER_PRIORITY'
} as const;
export type CollisionBehavior =
  (typeof CollisionBehavior)[keyof typeof CollisionBehavior];

/**
 * AltitudeMode for specifying how altitude is interpreted for 3D elements.
 * This mirrors google.maps.maps3d.AltitudeMode but is available without waiting
 * for the API to load.
 */
export const AltitudeMode = {
  /** Allows to express objects relative to the average mean sea level. */
  ABSOLUTE: 'ABSOLUTE',
  /** Allows to express objects placed on the ground. */
  CLAMP_TO_GROUND: 'CLAMP_TO_GROUND',
  /** Allows to express objects relative to the ground surface. */
  RELATIVE_TO_GROUND: 'RELATIVE_TO_GROUND',
  /** Allows to express objects relative to the highest of ground+building+water surface. */
  RELATIVE_TO_MESH: 'RELATIVE_TO_MESH'
} as const;
export type AltitudeMode = (typeof AltitudeMode)[keyof typeof AltitudeMode];
