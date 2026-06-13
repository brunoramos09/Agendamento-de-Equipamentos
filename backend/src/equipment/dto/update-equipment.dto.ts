import { IsArray, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export enum EquipmentStatus {
  DISPONIVEL = 'DISPONIVEL',
  MANUTENCAO = 'MANUTENCAO',
  INATIVO = 'INATIVO',
}

export class UpdateEquipmentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  roomId?: number;

  @IsOptional()
  @IsString()
  serialNumber?: string;

  @IsOptional()
  @IsString()
  photo?: string;

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
  @IsArray()
  attachedDocuments?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  subdivisions?: number;

  @IsOptional()
  @IsEnum(EquipmentStatus)
  status?: EquipmentStatus;

  @IsString()
  @IsOptional()
  maintenanceResponsiblePerson?: string;

  @IsString()
  @IsOptional()
  maintenanceObservations?: string;
}
