import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
