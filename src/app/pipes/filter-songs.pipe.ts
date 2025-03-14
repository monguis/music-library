import { Pipe, PipeTransform } from '@angular/core';
import { SongModel } from '../models/song';
import { stringToDate } from '../helpers/dates';

@Pipe({
  name: 'filterSongs',
})
export class FilterSongPipe implements PipeTransform {
  transform(songs: SongModel[], releaseFrom?: string, releaseUntil?: string): SongModel[] {
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
}
