/** Windows exposes its user locale through the JavaScript Intl implementation. */
export function getDeviceLocaleTags(): string[] {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    return locale ? [locale] : [];
  } catch {
    return [];
  }
}
