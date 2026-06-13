import { IsInt, IsOptional, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMaintenanceDto {
  @Type(() => Number)
  @IsInt()
  equipmentId!: number;

  @IsDateString()
  @IsOptional()
  @Type(() => Date)
  startDate?: string | Date;

  @IsDateString()
  @IsOptional()
  @Type(() => Date)
  endDate?: string | Date;

  @IsString()
  @IsOptional()
  responsiblePerson?: string;

  @IsString()
  @IsOptional()
  observations?: string;
}

