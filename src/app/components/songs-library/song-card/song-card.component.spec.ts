import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SongCardComponent } from './song-card.component';
import { SongModel } from '../../../models/song';
import { CurrencyPipe, DatePipe } from '@angular/common';

describe('SongCardComponent', () => {
  let component: SongCardComponent;
  let fixture: ComponentFixture<SongCardComponent>;
  let deleteSpy: jasmine.Spy;
  let updateSpy: jasmine.Spy;

  const mockSong: SongModel = {
    id: '123',
    title: 'Test Song',
    artist: 'Test Artist',
    releaseDate: new Date('01-01-2015'),
    price: 5,
  } as SongModel;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SongCardComponent],
      providers: [DatePipe, CurrencyPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(SongCardComponent);
    component = fixture.componentInstance;
    component.song = mockSong;

    deleteSpy = spyOn(component.delete, 'emit');
    updateSpy = spyOn(component.update, 'emit');

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('emits delete event with song id when handleDelete is clicked', () => {
    component.handleDelete();
    expect(deleteSpy).toHaveBeenCalledWith(mockSong.id);
  });

  it('emits update event with song id when handleUpdate is called', () => {
    component.handleUpdate();
    expect(updateSpy).toHaveBeenCalledWith(mockSong.id);
  });

  it('binds song properties to the component', () => {
    expect(component.song).toEqual(mockSong);
  });

  it('renders the values correcty', () => {
    const titleField = fixture.nativeElement.querySelector(`[data-test-id="title"]`);
    const artistField = fixture.nativeElement.querySelector(`[data-test-id="artist"]`);
    const releaseDateField = fixture.nativeElement.querySelector(`[data-test-id="releaseDate"]`);
    const idField = fixture.nativeElement.querySelector(`[data-test-id="id"]`);
    const priceField = fixture.nativeElement.querySelector(`[data-test-id="price"]`);

    expect(titleField?.textContent?.trim()).toBe(`Title: ${mockSong.title}`);
    expect(artistField?.textContent?.trim()).toBe(`Artist: ${mockSong.artist}`);
    expect(releaseDateField?.textContent?.trim()).toBe(`Released in: Jan 1, 2015`);
    expect(idField?.textContent?.trim()).toBe(`ID: ${mockSong.id}`);
    expect(priceField?.textContent?.trim()).toBe('Price: $5.00');
  });

  it('calls handleDelete when delete button is clicked', () => {
    const deleteButton = fixture.nativeElement.querySelector('[data-test-id="delete-button"]');
    deleteButton.click();
    expect(deleteSpy).toHaveBeenCalledWith(mockSong.id);
  });

  it('calls handleUpdate when update button is clicked', () => {
    const updateButton = fixture.nativeElement.querySelector('[data-test-id="update-button"]');
    updateButton.click();
    expect(updateSpy).toHaveBeenCalledWith(mockSong.id);
  });
});
