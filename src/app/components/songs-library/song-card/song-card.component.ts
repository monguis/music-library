import { Component, Input } from '@angular/core';
import { Song } from '../../../models/model';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-song-card',
  imports: [DatePipe, RouterModule],
  templateUrl: './song-card.component.html',
  styleUrl: './song-card.component.scss',
})
export class SongCardComponent {
  @Input({ required: true }) public song!: Song;
}
