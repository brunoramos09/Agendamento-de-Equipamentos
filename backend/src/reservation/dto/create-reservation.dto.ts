import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ReservationEquipmentDto {
  @IsInt()
  equipmentId!: number;

  @IsOptional()
  @IsInt()
  subdivisionsQuantity?: number;
}

export class CreateReservationDto {
  @IsInt()
  userId!: number;

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
