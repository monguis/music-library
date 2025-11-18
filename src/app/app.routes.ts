import { Routes } from '@angular/router';
import { SongsLibraryComponent } from '@app/components/songs-library';
import { NonFoundComponent } from './components/non-found/non-found.component';

export const routes: Routes = [
  { path: '', component: SongsLibraryComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  {
    path: 'update/:id',
    loadComponent: () =>
      import('./components/song-form/song-form.component').then(mod => mod.SongFormComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./components/song-form/song-form.component').then(mod => mod.SongFormComponent),
  },
  { path: '**', component: NonFoundComponent },
];
