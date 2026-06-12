/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Delete,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';

@Controller('equipments')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get()
  findAll() {
    return this.equipmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.equipmentService.findOne(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/equipments',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
  create(@Body() body: CreateEquipmentDto, @UploadedFile() photo: any) {
    return this.equipmentService.create(body, photo);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.equipmentService.remove(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/equipments',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateEquipmentDto,
    @UploadedFile() photo?: any,
  ) {
    if (photo) {
      body.photo = photo.filename;
    }

    return this.equipmentService.update(id, body);
  }

  @Get(':id/report')
  async generateReport(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    await this.equipmentService.generateReport(id, res);
  }
}
