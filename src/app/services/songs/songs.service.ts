import { Injectable } from '@angular/core';
import { Song, SongDto } from '../../models/model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SongsService {
  private songList: Song[] = [
    { artist: 'Beck', title: 'Loser', id: '1', price: 5, releaseDate: new Date('05-07-2024') },
    { artist: 'Taylor Swift', title: 'Belong to me', id: '2', price: 5, releaseDate: new Date('05-03-2025') },
  ];
  public songList$ = new BehaviorSubject<Song[]>([]);
  public getList() {
    return this.songList.slice();
  }

  public getAllSongs() {
    this.songList$.next(this.songList.slice());
  }

  public addNewSong(song: SongDto) {
    this.songList.push(new Song(song));
    this.songList$.next(this.songList.slice());
  }
}
