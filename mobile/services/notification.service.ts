import { Booking } from '@/types';

export type NotificationType = 'success' | 'promo' | 'warning' | 'info';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timeAgo: string;
  unread: boolean;
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00`);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function bookingToNotification(booking: Booking, unread: boolean): AppNotification {
  const route = `${booking.route.from} → ${booking.route.to}`;

  if (booking.status === 'cancelled') {
    return {
      id: booking.id,
      type: 'warning',
      title: 'Booking Cancelled',
      body: `Your trip ${route} was cancelled.`,
      timeAgo: formatTimeAgo(booking.date),
      unread,
    };
  }

  if (booking.status === 'completed') {
    return {
      id: booking.id,
      type: 'info',
      title: 'Trip Completed',
      body: `Thanks for riding with ${booking.operator} on ${route}.`,
      timeAgo: formatTimeAgo(booking.date),
      unread: false,
    };
  }

  return {
    id: booking.id,
    type: 'success',
    title: 'Booking Confirmed',
    body: `${route} on ${booking.date} at ${booking.departureTime}. ${booking.seatCount} seat(s) booked.`,
    timeAgo: formatTimeAgo(booking.date),
    unread,
  };
}

export function buildNotificationsFromBookings(bookings: Booking[]): AppNotification[] {
  const sorted = [...bookings].sort((a, b) => b.date.localeCompare(a.date));
  const notifications = sorted.map((booking, index) =>
    bookingToNotification(booking, index === 0 && booking.status === 'upcoming'),
  );

  if (notifications.length === 0) {
    return [
      {
        id: 'welcome',
        type: 'info',
        title: 'Welcome to NittoJatra',
        body: 'Search for rides across Dhaka and book your next trip.',
        timeAgo: 'Just now',
        unread: true,
      },
    ];
  }

  return notifications;
}
