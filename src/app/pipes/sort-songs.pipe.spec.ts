import { SortSongsPipe } from './sort-songs.pipe';
import { SongModel } from '../models/song';

describe('SortSongsPipe', () => {
  let pipe: SortSongsPipe;

  beforeEach(() => {
    pipe = new SortSongsPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  const testSongs: SongModel[] = [
    { id: '1', title: 'Song A', artist: 'Artist X', releaseDate: new Date('01-01-2001'), price: 5 },
    {
      id: '2',
      title: 'Song C',
      artist: 'Artist Z',
      releaseDate: new Date('01-01-2002'),
      price: 10,
    },
    { id: '3', title: 'Song B', artist: 'Artist Y', releaseDate: new Date('01-01-2003'), price: 7 },
  ] as SongModel[];

  it('should sort songs by a string field in descending order', () => {
    const sortedSongs = pipe.transform(testSongs, 'title', true);
    expect(sortedSongs[0].title).toBe('Song C');
    expect(sortedSongs[1].title).toBe('Song B');
    expect(sortedSongs[2].title).toBe('Song A');
  });

  it('should sort songs by a string field in ascending order', () => {
    const sortedSongs = pipe.transform(testSongs, 'title', false);
    expect(sortedSongs[0].title).toBe('Song A');
    expect(sortedSongs[1].title).toBe('Song B');
    expect(sortedSongs[2].title).toBe('Song C');
  });

  it('should sort songs by a number field in descending order', () => {
    const sortedSongs = pipe.transform(testSongs, 'price', true);
    expect(sortedSongs[0].price).toBe(10);
    expect(sortedSongs[1].price).toBe(7);
    expect(sortedSongs[2].price).toBe(5);
  });

  it('should sort songs by a number field in ascending order', () => {
    const sortedSongs = pipe.transform(testSongs, 'price', false);
    expect(sortedSongs[0].price).toBe(5);
    expect(sortedSongs[1].price).toBe(7);
    expect(sortedSongs[2].price).toBe(10);
  });

  it('should sort songs by a date field in descending order', () => {
    const sortedSongs = pipe.transform(testSongs, 'releaseDate', true);
    expect(sortedSongs[0].releaseDate.getTime()).toBeGreaterThan(
      sortedSongs[1].releaseDate.getTime()
    );
    expect(sortedSongs[1].releaseDate.getTime()).toBeGreaterThan(
      sortedSongs[2].releaseDate.getTime()
    );
  });

  it('should sort songs by a date field in ascending order', () => {
    const sortedSongs = pipe.transform(testSongs, 'releaseDate', false);
    expect(sortedSongs[0].releaseDate.getTime()).toBeLessThan(sortedSongs[1].releaseDate.getTime());
    expect(sortedSongs[1].releaseDate.getTime()).toBeLessThan(sortedSongs[2].releaseDate.getTime());
  });

  it('should return the original array if no field is provided', () => {
    const result = pipe.transform(testSongs);
    expect(result).toEqual(testSongs);
  });

  it('should return an empty array if the input is undefined', () => {
    const result = pipe.transform(undefined as any);
    expect(result).toEqual([]);
  });
});
