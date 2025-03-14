import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonFoundComponent } from './non-found.component';

describe('NonFoundComponent', () => {
  let component: NonFoundComponent;
  let fixture: ComponentFixture<NonFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonFoundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
