import { PaginateSongsPipe } from './paginate-songs.pipe';

describe('PaginateSongsPipe', () => {
  it('create an instance', () => {
    const pipe = new PaginateSongsPipe();
    expect(pipe).toBeTruthy();
  });
});
