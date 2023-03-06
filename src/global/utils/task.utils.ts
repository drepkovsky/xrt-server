/**
 * Matches a valid event name.
 * Matches only lowercase alphanumeric words withouth spaces, with dashes and underscores allowed
 */
export const EVENT_NAME_MATCH = /^[a-z0-9-_]+$/;

export function normalizeEventName(name: string) {
  return name
    .toLowerCase() // lowercase
    .replace(/[^a-z0-9-_]/g, ' ') // replace forbidden characters with spaces
    .replace(/\s+/g, '-'); // replace multiple spaces to single dash
}
