import { Resolver, Query } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { Profile } from './profile.model';

@Resolver((of) => Profile)
export class ProfileResolver {
  constructor(private profileService: ProfileService) {}

  @Query((returns) => [Profile])
  async profiles(): Promise<Profile[]> {
    return this.profileService.findAll();
  }
}
