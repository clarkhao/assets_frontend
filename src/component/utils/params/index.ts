
export function objectToURLSearchParams(
  obj: Record<string, string | number | Array<string>>
): URLSearchParams {
  const params = new URLSearchParams();

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      params.append(key, obj[key].toString());
    }
  }

  return params;
}
