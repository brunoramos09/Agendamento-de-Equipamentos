import { IsInt, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name!: string;

  @IsString()
  building!: string;

  @IsInt()
  floor!: number;

  @IsString()
  campus!: string;
}
