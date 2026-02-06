export function isVersionGreaterEqual(
  major: number,
  minor: number
): boolean | undefined {
  if (!google?.maps?.version) return undefined;

  const version = google.maps.version.split('.');

  const currentMajor = parseInt(version[0], 10);
  const currentMinor = parseInt(version[1], 10);

  return (
    currentMajor > major || (currentMajor === major && currentMinor >= minor)
  );
}
