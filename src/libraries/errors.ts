const shownMessages = new Set();

export function logErrorOnce(...args: Parameters<typeof console.error>) {
  const key = JSON.stringify(args);

  if (!shownMessages.has(key)) {
    shownMessages.add(key);

    console.error(...args);
  }
}
