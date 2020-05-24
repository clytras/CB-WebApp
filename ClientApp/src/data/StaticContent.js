
export function getStaticContent(bintTo, defaultContent) {
  if (window.__StaticContent && bintTo in window.__StaticContent) {
    return window.__StaticContent[bintTo];
  }

  return defaultContent;
}
