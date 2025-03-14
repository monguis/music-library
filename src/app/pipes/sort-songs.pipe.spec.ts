// import { SortSongsPipe } from './sort-songs.pipe';
// import { SongModel } from '../models/song';

// describe('SortSongsPipe', () => {
//   let pipe: SortSongsPipe;

//   beforeEach(() => {
//     pipe = new SortSongsPipe();
//   });

//   it('create an instance', () => {
//     expect(pipe).toBeTruthy();
//   });

//   it('should sort songs by a string field in descending order', () => {
//     const songs: SongModel[] = [
//       { title: 'Song A', artist: 'Artist X', releaseDate: new Date(), price: 5 },
//       { title: 'Song C', artist: 'Artist Z', releaseDate: new Date(), price: 10 },
//       { title: 'Song B', artist: 'Artist Y', releaseDate: new Date(), price: 7 },
//     ];

//     const sortedSongs = pipe.transform(songs, 'title', true);
//     expect(sortedSongs[0].title).toBe('Song C');
//     expect(sortedSongs[1].title).toBe('Song B');
//     expect(sortedSongs[2].title).toBe('Song A');
//   });

//   it('should sort songs by a string field in ascending order', () => {
//     const songs: SongModel[] = [
//       { title: 'Song A', artist: 'Artist X', releaseDate: new Date(), price: 5 },
//       { title: 'Song C', artist: 'Artist Z', releaseDate: new Date(), price: 10 },
//       { title: 'Song B', artist: 'Artist Y', releaseDate: new Date(), price: 7 },
//     ];

//     const sortedSongs = pipe.transform(songs, 'title', false);
//     expect(sortedSongs[0].title).toBe('Song A');
//     expect(sortedSongs[1].title).toBe('Song B');
//     expect(sortedSongs[2].title).toBe('Song C');
//   });

//   it('should sort songs by a number field in descending order', () => {
//     const songs: SongModel[] = [
//       { title: 'Song A', artist: 'Artist X', releaseDate: new Date(), price: 5 },
//       { title: 'Song C', artist: 'Artist Z', releaseDate: new Date(), price: 10 },
//       { title: 'Song B', artist: 'Artist Y', releaseDate: new Date(), price: 7 },
//     ];

//     const sortedSongs = pipe.transform(songs, 'price', true);
//     expect(sortedSongs[0].price).toBe(10);
//     expect(sortedSongs[1].price).toBe(7);
//     expect(sortedSongs[2].price).toBe(5);
//   });

//   it('should sort songs by a number field in ascending order', () => {
//     const songs: SongModel[] = [
//       { title: 'Song A', artist: 'Artist X', releaseDate: new Date(), price: 5 },
//       { title: 'Song C', artist: 'Artist Z', releaseDate: new Date(), price: 10 },
//       { title: 'Song B', artist: 'Artist Y', releaseDate: new Date(), price: 7 },
//     ];

//     const sortedSongs = pipe.transform(songs, 'price', false);
//     expect(sortedSongs[0].price).toBe(5);
//     expect(sortedSongs[1].price).toBe(7);
//     expect(sortedSongs[2].price).toBe(10);
//   });

//   it('should sort songs by a date field in descending order', () => {
//     const songs: SongModel[] = [
//       { title: 'Song A', artist: 'Artist X', releaseDate: new Date('2025-01-01'), price: 5 },
//       { title: 'Song C', artist: 'Artist Z', releaseDate: new Date('2024-01-01'), price: 10 },
//       { title: 'Song B', artist: 'Artist Y', releaseDate: new Date('2023-01-01'), price: 7 },
//     ];

//     const sortedSongs = pipe.transform(songs, 'releaseDate', true);
//     expect(sortedSongs[0].releaseDate.getTime()).toBeGreaterThan(
//       sortedSongs[1].releaseDate.getTime()
//     );
//     expect(sortedSongs[1].releaseDate.getTime()).toBeGreaterThan(
//       sortedSongs[2].releaseDate.getTime()
//     );
//   });

//   it('should sort songs by a date field in ascending order', () => {
//     const songs: SongModel[] = [
//       { title: 'Song A', artist: 'Artist X', releaseDate: new Date('2025-01-01'), price: 5 },
//       { title: 'Song C', artist: 'Artist Z', releaseDate: new Date('2024-01-01'), price: 10 },
//       { title: 'Song B', artist: 'Artist Y', releaseDate: new Date('2023-01-01'), price: 7 },
//     ];

//     const sortedSongs = pipe.transform(songs, 'releaseDate', false);
//     expect(sortedSongs[0].releaseDate.getTime()).toBeLessThan(sortedSongs[1].releaseDate.getTime());
//     expect(sortedSongs[1].releaseDate.getTime()).toBeLessThan(sortedSongs[2].releaseDate.getTime());
//   });

//   it('should return the original array if no field is provided', () => {
//     const songs: SongModel[] = [
//       { title: 'Song A', artist: 'Artist X', releaseDate: new Date(), price: 5 },
//       { title: 'Song C', artist: 'Artist Z', releaseDate: new Date(), price: 10 },
//       { title: 'Song B', artist: 'Artist Y', releaseDate: new Date(), price: 7 },
//     ];

//     const result = pipe.transform(songs);
//     expect(result).toEqual(songs);
//   });

//   it('should return an empty array if the input is undefined', () => {
//     const result = pipe.transform(undefined as any);
//     expect(result).toEqual([]);
//   });
// });
