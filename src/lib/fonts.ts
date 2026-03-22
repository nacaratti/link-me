const loaded = new Set<string>();

export function loadGoogleFont(fontFamily: string) {
  if (loaded.has(fontFamily)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:ital,wght@0,400;0,700&display=swap`;
  document.head.appendChild(link);
  loaded.add(fontFamily);
}
