import { Pipe, PipeTransform } from '@angular/core';
import { Song } from '../models/model';
import { stringToDate } from '../helpers/dates';

@Pipe({
  name: 'filterSongs',
})
export class FilterSongPipe implements PipeTransform {
  transform(songs: Song[], releaseFrom?: string, releaseUntil?: string): Song[] {
    if (!songs) return [];

    const from = stringToDate(releaseFrom);
    const until = stringToDate(releaseUntil);

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
