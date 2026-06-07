import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { Seat } from '@/types';

export const ROWS = 8;
const COLUMNS = ['A', 'B', 'C', 'D'] as const;
const WOMEN_ROWS = 2;

export function generateSeats(rideId: string): Seat[] {
  const seed = rideId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const seats: Seat[] = [];
  for (let row = 1; row <= ROWS; row++) {
    for (let col = 0; col < COLUMNS.length; col++) {
      const label = `${row}${COLUMNS[col]}`;
      const index = (row - 1) * COLUMNS.length + col;
      const isBooked = (seed + index * 7) % 5 === 0;
      let status: Seat['status'] = 'available';
      if (row <= WOMEN_ROWS) status = 'women';
      if (isBooked) status = 'booked';
      seats.push({ id: label, label, status });
    }
  }
  return seats;
}

interface SeatMapProps {
  seats: Seat[];
  selected: string[];
  onToggle: (seatId: string) => void;
}

function seatVisualStatus(seat: Seat, selected: boolean): Seat['status'] | 'selected' {
  if (selected) return 'selected';
  return seat.status;
}

export function SeatMap({ seats, selected, onToggle }: SeatMapProps) {
  const rows = Array.from({ length: ROWS }, (_, i) => i + 1);

  return (
    <View>
      <View style={styles.busTop}>
        <Ionicons name="boat-outline" size={18} color={Colors.textMuted} style={styles.wheel} />
        <Text style={styles.driverLabel}>Driver</Text>
      </View>

      <View style={styles.deck}>
        {rows.map((row) => {
          const seatsInRow = seats.filter((s) => parseInt(s.label, 10) === row);
          const left = seatsInRow.slice(0, 2);
          const right = seatsInRow.slice(2, 4);
          return (
            <View key={row} style={styles.row}>
              <View style={styles.pair}>
                {left.map((seat) => (
                  <SeatCell
                    key={seat.id}
                    seat={seat}
                    selected={selected.includes(seat.id)}
                    onToggle={onToggle}
                  />
                ))}
              </View>
              <View style={styles.aisle}>
                <Text style={styles.rowNumber}>{row}</Text>
              </View>
              <View style={styles.pair}>
                {right.map((seat) => (
                  <SeatCell
                    key={seat.id}
                    seat={seat}
                    selected={selected.includes(seat.id)}
                    onToggle={onToggle}
                  />
                ))}
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.legend}>
        <LegendItem color={Colors.surface} border={Colors.borderMid} label="Available" />
        <LegendItem color={Colors.primary} label="Selected" />
        <LegendItem color={Colors.borderMid} label="Booked" />
        <LegendItem color={Colors.accentLight} border={Colors.accent} label="Women" />
      </View>
    </View>
  );
}

function SeatCell({
  seat,
  selected,
  onToggle,
}: {
  seat: Seat;
  selected: boolean;
  onToggle: (id: string) => void;
}) {
  const visual = seatVisualStatus(seat, selected);
  const disabled = seat.status === 'booked';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={`Seat ${seat.label}, ${disabled ? 'booked' : visual}`}
      disabled={disabled}
      onPress={() => onToggle(seat.id)}
      style={[styles.seat, seatStyles[visual]]}
    >
      <Text style={[styles.seatLabel, (visual === 'selected' || visual === 'booked') && styles.seatLabelLight]}>
        {seat.label}
      </Text>
    </Pressable>
  );
}

function LegendItem({ color, border, label }: { color: string; border?: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View
        style={[
          styles.legendSwatch,
          { backgroundColor: color, borderColor: border ?? color, borderWidth: border ? 1.5 : 0 },
        ]}
      />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const seatStyles = StyleSheet.create({
  available: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.borderMid,
  },
  selected: {
    backgroundColor: Colors.primary,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  booked: {
    backgroundColor: Colors.borderMid,
    borderWidth: 1.5,
    borderColor: Colors.borderMid,
  },
  women: {
    backgroundColor: Colors.accentLight,
    borderWidth: 1.5,
    borderColor: Colors.accent,
  },
});

const styles = StyleSheet.create({
  busTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderMid,
    marginBottom: Spacing.base,
  },
  wheel: {
    transform: [{ rotate: '90deg' }],
  },
  driverLabel: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
  },
  deck: {
    gap: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pair: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  aisle: {
    width: 40,
    alignItems: 'center',
  },
  rowNumber: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
  },
  seat: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatLabel: {
    fontFamily: Typography.fonts.semibold,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
  },
  seatLabelLight: {
    color: Colors.white,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.base,
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  legendSwatch: {
    width: 18,
    height: 18,
    borderRadius: 5,
  },
  legendLabel: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
  },
});
