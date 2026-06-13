import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export enum EquipmentStatus {
  DISPONIVEL = 'DISPONIVEL',
  MANUTENCAO = 'MANUTENCAO',
  INATIVO = 'INATIVO',
}

export class CreateEquipmentDto {
  @IsString()
  name!: string;

  @Type(() => Number)
  @IsInt()
  roomId!: number;

  @IsOptional()
  @IsString()
  serialNumber?: string;

  @IsOptional()
  @IsString()
  responsibleEmployee?: string;

  @IsOptional()
  @IsString()
  observations?: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  subdivisions?: number;

  @IsOptional()
  @IsEnum(EquipmentStatus)
  status?: EquipmentStatus;

  @IsOptional()
  @IsString()
  maintenanceResponsiblePerson?: string;

  @IsOptional()
  @IsString()
  maintenanceObservations?: string;
}
