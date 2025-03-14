import { Routes } from '@angular/router';
import { SongsLibraryComponent } from './components/songs-library/songs-library.component';
import { SongFormComponent } from './components/song-form/song-form.component';
import { NonFoundComponent } from './components/non-found/non-found.component';

export const routes: Routes = [
  { path: '', component: SongsLibraryComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'update/:id', component: SongFormComponent },
  { path: 'create', component: SongFormComponent },
  { path: '**', component: NonFoundComponent },
];
