import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { SongModel } from '../models';

@Pipe({
  name: 'paginateSongs',
})
@Injectable({ providedIn: 'root' })
export class PaginateSongsPipe implements PipeTransform {
  transform(value: SongModel[], page: number, perPage: number): SongModel[] {
    if (!value?.length) return [];

    const startingOffset = page * perPage;

    if (startingOffset > value.length) {
      return [];
    }
    return value.slice(startingOffset, startingOffset + perPage);
  }
}
