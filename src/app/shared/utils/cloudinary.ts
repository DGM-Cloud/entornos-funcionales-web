/**
 * Inserta transformaciones de tamaño Cloudinary tras `/upload/`,
 * preservando o reemplazando un segmento de transformaciones previo.
 */
export function cloudinarySized(url: string, width: number): string {
  const marker = '/upload/';
  const index = url.indexOf(marker);
  if (index === -1) {
    return url;
  }

  const prefix = url.slice(0, index + marker.length);
  const rest = url.slice(index + marker.length);
  const transforms = `f_auto,q_auto,c_limit,w_${width}`;
  const firstSlash = rest.indexOf('/');
  if (firstSlash === -1) {
    return `${prefix}${transforms}/${rest}`;
  }

  const firstSegment = rest.slice(0, firstSlash);
  const remainder = rest.slice(firstSlash + 1);
  const looksLikeTransforms =
    !/^v\d+/.test(firstSegment) &&
    !firstSegment.includes('.') &&
    (firstSegment.includes(',') ||
      firstSegment.startsWith('f_') ||
      firstSegment.startsWith('q_') ||
      firstSegment.startsWith('w_') ||
      firstSegment.startsWith('c_'));

  if (looksLikeTransforms) {
    return `${prefix}${transforms}/${remainder}`;
  }

  return `${prefix}${transforms}/${rest}`;
}

export function cloudinarySrcset(
  url: string,
  widths: readonly number[],
): string {
  return widths.map((w) => `${cloudinarySized(url, w)} ${w}w`).join(', ');
}
