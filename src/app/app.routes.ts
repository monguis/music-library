import { Routes } from '@angular/router';
import { SongsLibraryComponent } from './components/songs-library/songs-library.component';
import { NonFoundComponent } from './components/non-found/non-found.component';

export const routes: Routes = [
  { path: '', component: SongsLibraryComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  {
    path: 'update/:id',
    loadComponent: () =>
      import('./components/song-form/song-form.component').then(mod => mod.SongFormComponent), // Dynamically imports and returns the component class
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./components/song-form/song-form.component').then(mod => mod.SongFormComponent), // Dynamically imports and returns the component class
  },
  { path: '**', component: NonFoundComponent },
];
