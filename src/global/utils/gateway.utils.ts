/**
 * converts a something/:somethingId/:somethingElseId to regex that matches the route
 * allow regex inside the namespace like this: something/:somethingId/:somethingElseId([a-z]+) or something/:type(video|audio)
 **/
export function buildNamespaceRegex(namespace: string) {
  const parts = namespace.split('/').map(part => {
    if (part.startsWith(':')) {
      const [param, regex] = part.slice(1).split('(');
      return regex ? `(?<${param}>${regex.slice(0, -1)})` : `(?<${param}>[^/]+)`;
    }
    return part;
  });
  return new RegExp(`${parts.join('/')}`);
}

/**
 * converts a  something/:somethingId/:somethingElseId to an object with the params
 * eg. route = 'something/123/456' and namespace defined as regex = /something/(?<somethingId>[^/]+)/(?<somethingElseId>[^/]+)
 * */
export function parseNamespace(namespace: RegExp, route: string) {
  const match = route.match(namespace);
  if (!match) return {};
  const params = match.groups;
  return params || {};
}
