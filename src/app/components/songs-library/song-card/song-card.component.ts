import { Component, Input } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SongModel } from '../../../models/song';

@Component({
  selector: 'article.song-card',
  imports: [DatePipe, CurrencyPipe, RouterModule],
  templateUrl: './song-card.component.html',
  styleUrl: './song-card.component.scss',
})
export class SongCardComponent {
  @Input({ required: true }) public song!: SongModel;
}
