/* eslint-disable */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReturnReservationDto } from './dto/return-reservation.dto';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get('debug/users')
  debugUsers() {
    return this.reservationService.debugUsers();
  }

  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.reservationService.findAll(userId ? Number(userId) : undefined);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.findOne(id);
  }

  @Post()
  create(@Body() data: CreateReservationDto) {
    return this.reservationService.create(data);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateReservationDto,
  ) {
    return this.reservationService.update(id, data);
  }

  @Patch(':id/return')
  returnReservation(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReturnReservationDto,
  ) {
    return this.reservationService.returnReservation(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.remove(id);
  }
}
