import { Component } from '@angular/core';
import { SongModel } from '../../../models';
import { SongsService } from '../../../services/songs/songs.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-songs-pagination',
  imports: [FormsModule],
  templateUrl: './songs-pagination.component.html',
  styleUrl: './songs-pagination.component.scss',
})
export class SongsPaginationComponent {
  public paginatedSet: SongModel[] = [];

  constructor(private songService: SongsService) {}

  get lastPage() {
    return this.songService.getPaginationInfo.lastPage!;
  }

  get currentPage() {
    return this.songService.getPaginationInfo.page!;
  }

  get perPage() {
    return this.songService.getPaginationInfo.perPage!;
  }

  setPage(page: number) {
    this.songService.goToPage(page);
  }

  canGoToPage(page: number) {
    return this.songService.canGoToPage(page);
  }

  setPerPageSize(event: string) {
    this.songService.setPerPageSize(Number(event));
  }
}
