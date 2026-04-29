import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateReservationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  equipmentId?: number;

  @IsOptional()
  @IsString()
  requester?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
