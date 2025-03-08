import { Component, OnInit } from '@angular/core';
import { SongsHeaderComponent } from './songs-header/songs-header.component';
import { SongCardComponent } from './song-card/song-card.component';
import { SongsService } from '../../services/songs.service';
import { Song } from '../../models/model';

@Component({
  selector: 'app-songs-library',
  imports: [SongsHeaderComponent, SongCardComponent],
  templateUrl: './songs-library.component.html',
  styleUrl: './songs-library.component.scss',
})
export class SongsLibraryComponent implements OnInit {
  constructor(private songsService: SongsService) {}
  public songList: Song[] = [];
  ngOnInit(): void {
    this.songList = this.songsService.getList();
  }
}
