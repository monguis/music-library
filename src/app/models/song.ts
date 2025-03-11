export class SongModel {
  public id?: string;
  public title: string;
  public artist: string;
  public releaseDate: Date;
  public price: number;

  constructor(dto: SongDto) {
    this.id = dto.id;
    this.title = dto.title;
    this.artist = dto.artist;
    this.releaseDate = new Date(dto.release_date);
    this.price = dto.price;
  }

  static toDto(song: SongModel): SongDto {
    return {
      id: song.id,
      title: song.title,
      artist: song.artist,
      release_date: song.releaseDate.toISOString(),
      price: song.price,
    };
  }
}

export interface SongDto {
  id?: string;
  title: string;
  artist: string;
  release_date: string;
  price: number;
}
