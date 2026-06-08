import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ReservationEquipmentDto {
  @IsInt()
  @Min(1)
  equipmentId!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  subdivisionsQuantity?: number;
}

export class CreateReservationDto {
  @IsString()
  user!: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsOptional()
  @IsString()
  observations?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReservationEquipmentDto)
  equipments!: ReservationEquipmentDto[];
}
