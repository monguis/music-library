import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongsLibraryComponent } from './songs-library.component';

describe('SongsLibraryComponent', () => {
  let component: SongsLibraryComponent;
  let fixture: ComponentFixture<SongsLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongsLibraryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SongsLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
