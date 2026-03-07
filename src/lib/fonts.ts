const loaded = new Set<string>();

export function loadGoogleFont(fontFamily: string) {
  if (loaded.has(fontFamily)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
  loaded.add(fontFamily);
}
