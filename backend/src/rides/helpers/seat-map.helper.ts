import { SeatDto } from '../dto/seat.dto';

const ROW_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function generateSeatMap(
  totalSeats: number,
  serviceType: string,
): SeatDto[] {
  const seatsPerRow = 4;
  const totalRows = Math.ceil(totalSeats / seatsPerRow);
  const seats: SeatDto[] = [];

  for (let row = 1; row <= totalRows; row++) {
    const rowLetter = ROW_LETTERS[row - 1];
    for (let column = 1; column <= seatsPerRow; column++) {
      if (seats.length >= totalSeats) {
        break;
      }

      const isWomenSpecial = serviceType === 'women-special';
      const status = isWomenSpecial && row <= 2 ? 'women-only' : 'available';

      seats.push({
        seatNumber: `${rowLetter}${column}`,
        row,
        column,
        status,
      });
    }
  }

  return seats;
}
