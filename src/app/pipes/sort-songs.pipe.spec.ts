import { SortSongsPipe } from './sort-songs.pipe';

describe('SortGenericPipe', () => {
  it('create an instance', () => {
    const pipe = new SortSongsPipe();
    expect(pipe).toBeTruthy();
  });
});
