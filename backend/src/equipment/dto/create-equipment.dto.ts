import { IsArray, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export enum EquipmentStatus {
  DISPONIVEL = 'DISPONIVEL',
  MANUTENCAO = 'MANUTENCAO',
  INATIVO = 'INATIVO',
}

export class CreateEquipmentDto {
  @IsString()
  name!: string;

  @IsInt()
  roomId!: number;

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
  @IsInt()
  subdivisions?: number;

  @IsOptional()
  @IsEnum(EquipmentStatus)
  status?: EquipmentStatus;
}
