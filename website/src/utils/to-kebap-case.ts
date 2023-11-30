export function toKebapCase(s: string) {
  const matches = s.match(
    /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
  );

  if (!matches) return s;

  return matches.join('-').toLowerCase();
}
