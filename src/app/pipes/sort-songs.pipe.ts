import { Pipe, PipeTransform } from '@angular/core';
import { SongModel } from '../models/song';

type sortType = 'asc' | 'desc';

@Pipe({
  name: 'sortSongs',
})
export class SortSongsPipe implements PipeTransform {
  transform(array: SongModel[], field: keyof SongModel, order: sortType = 'asc'): SongModel[] {
    if (!array) return [];
    if (!array || !field) return array;
    return [...array].sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];

      const ascending = order === 'asc';

      if (valueA instanceof Date && valueB instanceof Date) {
        return ascending
          ? valueA.getTime() - valueB.getTime()
          : valueB.getTime() - valueA.getTime();
      } else if (typeof valueA === 'string' && typeof valueB === 'string') {
        return ascending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return ascending ? valueA - valueB : valueB - valueA;
      }
      return 0;
    });
  }
}
