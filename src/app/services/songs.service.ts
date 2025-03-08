import { Injectable } from '@angular/core';
import { Song, SongDto } from '../models/model';

@Injectable({
  providedIn: 'root',
})
export class SongsService {
  private songList: Song[] = [
    { artist: 'Beck', title: 'Loser', id: '1', price: 5, releaseDate: new Date() },
    { artist: 'Taylor Swift', title: 'Belong to me', id: '2', price: 5, releaseDate: new Date() },
  ];
  public getList() {
    return this.songList.slice();
  }

  public addNewSong(song: SongDto) {
    this.songList.push(new Song(song));
  }
}
