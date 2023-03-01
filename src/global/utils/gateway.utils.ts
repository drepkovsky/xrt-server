/**
 * converts a something/:somethingId/:somethingElseId to regex that matches the route
 **/
export function buildNamespaceRegex(namespace: string) {
  const parts = namespace.split('/').map((part) => {
    if (part.startsWith(':')) {
      return '[^/]+';
    }
    return part;
  });
  return new RegExp(`^${parts.join('/')}$`);
}

/**
 * converts a  something/:somethingId/:somethingElseId to an object with the params
 * eg. route = 'something/123/456' and namespace = 'something/:somethingId/:somethingElseId' will return { somethingId: '123', somethingElseId: '456' }
 * */
export function parseNamespace(namespace: string, route: string) {
  const parts = namespace.split('/');
  const routeParts = route.split('/');
  const params = {};
  parts.forEach((part, i) => {
    if (part.startsWith(':')) {
      params[part.slice(1)] = routeParts[i];
    }
  });
  return params;
}
