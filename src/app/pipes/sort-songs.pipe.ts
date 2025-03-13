import { Pipe, PipeTransform } from '@angular/core';
import { SongModel } from '../models/song';

type sortType = 'asc' | 'desc';

@Pipe({
  name: 'sortSongs',
})
export class SortSongsPipe implements PipeTransform {
  transform(array: SongModel[], field?: keyof SongModel, descending: boolean = true): SongModel[] {
    if (!array) return [];
    if (!array || !field) return array;
    return [...array].sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];

      if (valueA instanceof Date && valueB instanceof Date) {
        return descending
          ? valueB.getTime() - valueA.getTime()
          : valueA.getTime() - valueB.getTime();
      } else if (typeof valueA === 'string' && typeof valueB === 'string') {
        return descending ? valueB.localeCompare(valueA) : valueA.localeCompare(valueB);
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return descending ? valueB - valueA : valueA - valueB;
      }
      return 0;
    });
  }
}
