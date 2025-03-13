import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SongModel } from '../../../models/song';

@Component({
  selector: 'article.song-card',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './song-card.component.html',
  styleUrl: './song-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongCardComponent {
  @Input({ required: true }) public song!: SongModel;
  @Output() public delete = new EventEmitter<string>();
  @Output() public update = new EventEmitter<string>();

  handleDelete() {
    this.delete.emit(this.song.id);
  }

  handleUpdate() {
    this.update.emit(this.song.id);
  }
}
