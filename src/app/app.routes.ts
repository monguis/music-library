import { Routes } from '@angular/router';
import { SongsLibraryComponent } from './components/songs-library/songs-library.component';
import { SongFormComponent } from './component/song-form/song-form.component';

export const routes: Routes = [
  { component: SongsLibraryComponent, path: '' },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { component: SongFormComponent, path: ':id/update' },
  { component: SongFormComponent, path: 'create' },
];
