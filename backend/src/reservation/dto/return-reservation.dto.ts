import { IsBoolean, IsOptional, IsString, ValidateIf } from 'class-validator';

export class ReturnReservationDto {
  @IsOptional()
  @IsBoolean()
  hadIssue?: boolean;

  @ValidateIf((o: ReturnReservationDto) => o.hadIssue === true)
  @IsString()
  returnObservations?: string;
}