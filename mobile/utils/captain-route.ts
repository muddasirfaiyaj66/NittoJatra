/** Parse captain wizard time labels like "08:00 AM" into an ISO departure time. */
export function parseCaptainDepartureTime(timeLabel: string): string {
  const trimmed = timeLabel.trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  const departure = new Date();

  if (!match) {
    departure.setHours(8, 0, 0, 0);
  } else {
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const meridiem = match[3].toUpperCase();

    if (meridiem === 'PM' && hours < 12) {
      hours += 12;
    }
    if (meridiem === 'AM' && hours === 12) {
      hours = 0;
    }

    departure.setHours(hours, minutes, 0, 0);
  }

  return departure.toISOString();
}

export function localDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function resolveCaptainServiceType(ac: boolean, womenOnly: boolean): 'ac' | 'non-ac' | 'women-special' {
  if (womenOnly) {
    return 'women-special';
  }
  return ac ? 'ac' : 'non-ac';
}
