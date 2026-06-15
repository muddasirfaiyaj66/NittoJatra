export function assignDocumentId<T extends { _id?: string }>(
  dto: T,
  source: { _id?: { toString(): string } | string },
): T {
  const rawId = source._id;
  if (rawId) {
    dto._id = typeof rawId === 'string' ? rawId : rawId.toString();
  }
  return dto;
}
