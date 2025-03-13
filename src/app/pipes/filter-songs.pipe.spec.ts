import { SongModel } from '../models/song';
import { FilterSongPipe } from './filter-songs.pipe';

describe('FiltersongPipe', () => {
  const testData: SongModel[] = [
    {
      artist: 'Nirvana',
      title: 'Smells Like Teen Spirit',
      id: '2',
      price: 6,
      releaseDate: new Date('09-24-1991'),
    },
    {
      artist: 'Taylor Swift',
      title: 'Shake It Off',
      id: '4',
      price: 7,
      releaseDate: new Date('08-18-2014'),
    },
    { artist: 'Adele', title: 'Hello', id: '3', price: 8, releaseDate: new Date('10-23-2015') },
    {
      artist: 'Ed Sheeran',
      title: 'Shape of You',
      id: '5',
      price: 9,
      releaseDate: new Date('01-06-2017'),
    },
    {
      artist: 'Billie Eilish',
      title: 'Bad Guy',
      id: '6',
      price: 7,
      releaseDate: new Date('03-29-2019'),
    },
  ] as SongModel[];

  it('create an instance', () => {
    const pipe = new FilterSongPipe();
    expect(pipe).toBeTruthy();
  });

  it('returns the original list if no valid input is provided', () => {
    const pipe = new FilterSongPipe();
    const newList = pipe.transform(testData, 'not valid from', 'not valid until');
    expect(newList.length).toBe(testData.length);
  });

  it('returns filtered list when valid from value is provided', () => {
    const pipe = new FilterSongPipe();
    const newList = pipe.transform(testData, '2010-01-01', 'not valid until');

    expect(newList.length).toBe(4);
    for (const song of newList) {
      expect(song.artist).not.toBe('Nirvana');
    }
  });

  it('returns filtered list when valid until value is provided', () => {
    const pipe = new FilterSongPipe();
    const newList = pipe.transform(testData, 'not valid from', '2010-01-01');

    expect(newList.length).toBe(1);
    expect(newList[0].artist).toBe('Nirvana');
  });

  it('returns filtered list when valid from and until values are provided', () => {
    const pipe = new FilterSongPipe();
    const newList = pipe.transform(testData, '2012-01-01', '2016-01-01');

    expect(newList.length).toBe(2);
    expect(newList[0].artist).toBe('Taylor Swift');
    expect(newList[1].artist).toBe('Adele');
  });
});
