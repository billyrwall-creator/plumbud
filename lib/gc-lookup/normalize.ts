export function normalizeGcNumber(input: string) {
  const trimmed = input.trim().toUpperCase();
  const withoutPrefix = trimmed.replace(/^GC/, "");
  return withoutPrefix.replace(/[^A-Z0-9]/g, "");
}
