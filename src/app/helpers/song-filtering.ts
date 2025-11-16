import { SongModel } from '../models';
import { stringToDate } from './dates';

export function filterByDate(
  songs: SongModel[],
  releaseFrom?: string,
  releaseUntil?: string
): SongModel[] {
  if (!songs) return [];

  const from = stringToDate(releaseFrom ?? '');
  const until = stringToDate(releaseUntil ?? '');

  if (!from && !until) return songs;

  return songs.filter(song => {
    if (from && until) {
      return song.releaseDate > from && song.releaseDate < until;
    } else if (from) {
      return song.releaseDate > from;
    } else {
      return song.releaseDate < until!;
    }
  });
}

export function sortedere(
  array: SongModel[],
  field?: keyof SongModel,
  descending = true
): SongModel[] {
  if (!array) return [];
  if (!array || !field) return array;
  return [...array].sort((a, b) => {
    const valueA = a[field];
    const valueB = b[field];

    if (valueA instanceof Date && valueB instanceof Date) {
      return descending ? valueB.getTime() - valueA.getTime() : valueA.getTime() - valueB.getTime();
    } else if (typeof valueA === 'string' && typeof valueB === 'string') {
      return descending ? valueB.localeCompare(valueA) : valueA.localeCompare(valueB);
    } else if (typeof valueA === 'number' && typeof valueB === 'number') {
      return descending ? valueB - valueA : valueA - valueB;
    }
    return 0;
  });
}
