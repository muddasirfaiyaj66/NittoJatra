const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function randomSegment(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += ALPHANUMERIC.charAt(
      Math.floor(Math.random() * ALPHANUMERIC.length),
    );
  }
  return result;
}

export function generateBookingId(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const segment = randomSegment(4);
  return `NJ-${year}${month}${day}-${segment}`;
}
