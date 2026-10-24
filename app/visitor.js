// A stable, random id per browser, used instead of a real login id.
//
// Datadog Experiments assign each subject to a variant with the flag
// targetingKey, then join those exposures to RUM / Product Analytics events by
// usr.id. Both must be the same value, and it must not change between visits,
// so it is generated once and kept in localStorage. In a real app, use your
// internal user id after login instead.
const KEY = 'demo_visitor_id';

export function getVisitorId() {
  if (typeof window === 'undefined') return undefined;
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    // localStorage blocked (e.g. some private modes): fall back to a per-load id.
    return crypto.randomUUID();
  }
}
