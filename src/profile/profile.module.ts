import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { ProfileResolver } from './profile.resolver';

@Module({
  providers: [ProfileService, ProfileResolver],
  controllers: [ProfileController]
})
export class ProfileModule {}
