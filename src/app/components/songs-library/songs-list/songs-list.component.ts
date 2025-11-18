import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  input,
  Input,
  Output,
} from '@angular/core';
import { FilterSongPipe, SortSongsPipe } from '@app/pipes';
import { SongModel, FilterOptions } from '@app/models';
import { SongCardComponent } from '@app/components/songs-library';

@Component({
  selector: 'app-songs-list',
  imports: [SongCardComponent],
  templateUrl: './songs-list.component.html',
  styleUrl: './songs-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongsListComponent {
  public songList = input<SongModel[]>([]);
  public filterOptions = input<FilterOptions<SongModel>>();
  @Output() private cardDelete = new EventEmitter<string>();
  @Output() private cardUpdate = new EventEmitter<string>();

  private readonly filter = new FilterSongPipe();
  private readonly sort = new SortSongsPipe();

  readonly filteredSongs = computed(() => {
    const list = this.songList() ?? [];
    const options = this.filterOptions();

    if (!options) return list;

    const filtered = this.filter.transform(list, options.from, options.until);
    return this.sort.transform(filtered, options.sortby, options.sortingDesc);
  });
}
