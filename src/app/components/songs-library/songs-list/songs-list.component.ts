import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SongModel, FilterOptions } from '../../../models';
import { SongCardComponent } from '../song-card/song-card.component';

@Component({
  selector: 'app-songs-list',
  imports: [SongCardComponent],
  templateUrl: './songs-list.component.html',
  styleUrl: './songs-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongsListComponent {
  @Input({ required: true }) public filterOptions!: FilterOptions<SongModel>;
  @Input({ required: true }) public songList!: SongModel[];
  @Output() private cardDelete = new EventEmitter<string>();
  @Output() private cardUpdate = new EventEmitter<string>();

  onDelete(id: string) {
    this.cardDelete.emit(id);
  }
  onUpdate(id: string) {
    this.cardUpdate.emit(id);
  }
}
