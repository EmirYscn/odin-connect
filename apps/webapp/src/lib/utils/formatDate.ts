import { format, formatDistance } from "date-fns";

export const formatDate = (dateString: string) => {
  return format(new Date(dateString), "h:MM aa · dd MMM, yyyy");
};

export const formatTimeAgo = (dateString: string) => {
  return formatDistance(new Date(dateString), new Date(), {
    addSuffix: true,
  });
};

export function formatDateToHour(date: Date | string): string {
  const formattedDate = new Date(date).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return formattedDate;
}

export function formatJoinedDate(date: Date | string): string {
  return format(date, "MMM yyyy");
}
