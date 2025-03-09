import { Component, OnDestroy, OnInit } from '@angular/core';
import { SongsService } from '../../services/songs/songs.service';
import { Song } from '../../models/model';
import { SongCardComponent } from './song-card/song-card.component';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-songs-library',
  imports: [SongCardComponent],
  templateUrl: './songs-library.component.html',
  styleUrl: './songs-library.component.scss',
})
export class SongsLibraryComponent implements OnInit, OnDestroy {
  constructor(private songsService: SongsService) {}
  public songList: Song[] = [];
  private songsSubscription?: Subscription;
  sortTiles: string[] = [];

  ngOnInit(): void {
    this.songsSubscription = this.songsService.songList$.subscribe(newList => {
      this.songList = newList;
      this.sortTiles = Object.keys(this.songList[0]);
    });
    this.songsService.getAllSongs();
  }

  ngOnDestroy(): void {
    this.songsSubscription?.unsubscribe();
  }
}
