import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SongsListComponent } from './songs-list.component';
import { SongModel } from '../../../models/song';
import { FilterSongPipe } from '../../../pipes/filter-songs.pipe';
import { SortSongsPipe } from '../../../pipes/sort-songs.pipe';
import { SongCardComponent } from '../song-card/song-card.component';
import { FilterOptions } from '../../../models/sorting-options';
import { EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('SongsListComponent', () => {
  let component: SongsListComponent;
  let fixture: ComponentFixture<SongsListComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SongsListComponent);
    component = fixture.componentInstance;
    component.filterOptions = {};
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
