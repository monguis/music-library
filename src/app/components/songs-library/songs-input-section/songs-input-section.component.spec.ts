import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongsInputSectionComponent } from './songs-input-section.component';

describe('SongsInputSectionComponent', () => {
  let component: SongsInputSectionComponent;
  let fixture: ComponentFixture<SongsInputSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongsInputSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongsInputSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
