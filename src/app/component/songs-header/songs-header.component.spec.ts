import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongsHeaderComponent } from './songs-header.component';

describe('SongsHeaderComponent', () => {
  let component: SongsHeaderComponent;
  let fixture: ComponentFixture<SongsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongsHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
