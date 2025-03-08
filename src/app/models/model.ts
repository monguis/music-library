export class Song {
  public id: string;
  public title: string;
  public artist: string;
  public releaseDate: Date;
  public price: number;

  constructor(dto: SongDto) {
    this.id = dto.id;
    this.title = dto.title;
    this.artist = dto.artist;
    this.releaseDate = new Date();
    this.price = dto.price;
  }
}

export interface SongDto {
  id: string;
  title: string;
  artist: string;
  release_date: string;
  price: number;
}
