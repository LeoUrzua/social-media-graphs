import { Resolver, Query, Args } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { Profile } from './profile.model';

@Resolver((of) => Profile)
export class ProfileResolver {
  constructor(private profileService: ProfileService) {}

  @Query((returns) => [Profile])
  async profiles(): Promise<Profile[]> {
    return this.profileService.findAll();
  }

  @Query(() => Profile, { nullable: true })
  async profile(@Args('id') id: string): Promise<Profile | undefined> {
    return this.profileService.findOne();
  }
}
