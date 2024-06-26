import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveField,
  Parent,
  Int,
} from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { Profile } from './profile.model';
import { UpdateProfileInput } from './dto/profile.dto';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private profileService: ProfileService) {}

  @ResolveField('friends', () => [Profile], { nullable: 'itemsAndList' })
  async getFriends(@Parent() profile: Profile): Promise<Profile[] | null> {
    return this.profileService.findFriendsById(profile.id);
  }

  @Query(() => [Profile])
  async profiles(): Promise<Profile[]> {
    return this.profileService.findAll();
  }

  @Query(() => Profile, { nullable: true })
  async profile(@Args('id') id: string): Promise<Profile | undefined> {
    return this.profileService.findOne(id);
  }

  @Query(() => Int)
  async relationshipDistance(
    @Args('profileId') profileId: string,
    @Args('targetProfileId') targetProfileId: string,
  ): Promise<number> {
    if (profileId === targetProfileId) return 0;

    return this.profileService.getShortestRelationshipDistance(
      profileId,
      targetProfileId,
    );
  }

  @Mutation(() => Profile)
  async createProfile(
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
    @Args('bio', { nullable: true }) bio?: string,
  ): Promise<Profile> {
    return this.profileService.create({ firstName, lastName, bio });
  }

  @Mutation(() => Boolean)
  async removeProfile(@Args('id') id: string): Promise<boolean> {
    return this.profileService.remove(id);
  }

  @Mutation(() => Profile)
  async updateProfile(
    @Args('id') id: string,
    @Args('input') input: UpdateProfileInput,
  ): Promise<Profile> {
    return this.profileService.update(id, input);
  }

  @Mutation(() => Profile)
  async addFriend(
    @Args('profileId') profileId: string,
    @Args('friendId') friendId: string,
  ): Promise<Profile> {
    return this.profileService.addFriend(profileId, friendId);
  }

  @Mutation(() => Profile)
  async removeFriend(
    @Args('profileId') profileId: string,
    @Args('friendId') friendId: string,
  ): Promise<Profile> {
    return this.profileService.removeFriend(profileId, friendId);
  }
}
