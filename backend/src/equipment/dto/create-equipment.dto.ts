import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateEquipmentDto {
  @IsString()
  name!: string;

  @IsInt()
  roomId!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
