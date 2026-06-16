import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Delete,
  UseInterceptors,
  Res,
  UploadedFiles,
} from '@nestjs/common';
import { Response } from 'express';

import { diskStorage } from 'multer';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
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
    FileFieldsInterceptor(
      [
        { name: 'photo', maxCount: 1 },
        { name: 'documents', maxCount: 20 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/equipments',
          filename: (req, file, cb) => {
            const originalName = Buffer.from(
              file.originalname,
              'latin1',
            ).toString('utf8');

            cb(null, `${Date.now()}-${originalName}`);
          },
        }),
      },
    ),
  )
  create(
    @Body() body: CreateEquipmentDto,
    @UploadedFiles()
    files: {
      photo?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    },
  ) {
    return this.equipmentService.create(body, files);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.equipmentService.remove(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'photo', maxCount: 1 },
        { name: 'documents', maxCount: 3 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/equipments',
          filename: (req, file, cb) => {
            const originalName = Buffer.from(
              file.originalname,
              'latin1',
            ).toString('utf8');

            cb(null, `${Date.now()}-${originalName}`);
          },
        }),
      },
    ),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateEquipmentDto,
    @UploadedFiles()
    files: {
      photo?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    },
  ) {
    return this.equipmentService.update(id, body, files);
  }

  @Get(':id/report')
  async generateReport(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    await this.equipmentService.generateReport(id, res);
  }
}
