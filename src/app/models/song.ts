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

  copy() {
    return new SongModel(SongModel.toDto(this));
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

  public equals(song: SongModel): boolean {
    return (
      song.id === this.id &&
      song.title === this.title &&
      song.artist === this.artist &&
      song.releaseDate.toISOString() === this.releaseDate.toISOString() &&
      song.price === this.price
    );
  }
}

export interface SongDto {
  id?: string;
  title: string;
  artist: string;
  release_date: string;
  price: number;
}
