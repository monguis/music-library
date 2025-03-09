import { Component, OnInit } from '@angular/core';
import { SongsService } from '../../services/songs.service';
import { Song } from '../../models/model';
import { SongCardComponent } from './song-card/song-card.component';

@Component({
  selector: 'app-songs-library',
  imports: [SongCardComponent],
  templateUrl: './songs-library.component.html',
  styleUrl: './songs-library.component.scss',
})
export class SongsLibraryComponent implements OnInit {
  constructor(private songsService: SongsService) {}
  public songList: Song[] = [];

  sortTiles: string[] = [];
  ngOnInit(): void {
    this.songList = this.songsService.getList();
    this.sortTiles = Object.keys(this.songList[0]);
  }
}
