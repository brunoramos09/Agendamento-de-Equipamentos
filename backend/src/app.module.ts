import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { EquipmentModule } from './equipment/equipment.module';
import { ReservationModule } from './reservation/reservation.module';
import { RoomModule } from './room/room.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MaintenanceModule } from './maintenance/maintenance.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    EquipmentModule,
    ReservationModule,
    RoomModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/equipments',

        filename: (req, file, callback) => {
          const filename = `${Date.now()}-${file.originalname}`;
          callback(null, filename);
        },
      }),
    }),
    MaintenanceModule,
  ],
})
export class AppModule {}
