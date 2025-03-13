import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterSongPipe } from '../../../pipes/filter-songs.pipe';
import { SortSongsPipe } from '../../../pipes/sort-songs.pipe';
import { SongModel } from '../../../models/song';
import { SongCardComponent } from '../song-card/song-card.component';
import { FilterOptions } from '../../../models/sorting-options';

@Component({
  selector: 'app-songs-list',
  imports: [FilterSongPipe, SortSongsPipe, SongCardComponent],
  templateUrl: './songs-list.component.html',
  styleUrl: './songs-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongsListComponent {
  @Input({ required: true }) public filterOptions!: FilterOptions;
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
