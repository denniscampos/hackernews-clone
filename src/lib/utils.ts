import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTimeSincePostCreation(createdAt: Date): string {
  const currentTime: Date = new Date(); // Get the current time
  const postTime: Date = new Date(createdAt); // Convert the createdAt timestamp to a Date object

  const timeDifference: number = currentTime.getTime() - postTime.getTime(); // Calculate the time difference in milliseconds
  const minutes = Math.floor(timeDifference / (1000 * 60)); // Convert milliseconds to minutes

  if (minutes < 1) {
    return 'Just now';
  } else if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else {
    const days = Math.floor(minutes / 1440);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
}

export function formatURL(url: string | null) {
  const urlWithoutProtocol = url?.replace(/^https?:\/\//, ''); // Remove http(s)://
  const urlWithoutWWW = urlWithoutProtocol?.replace(/^www\./, ''); // Remove www.

  return urlWithoutWWW;
}
