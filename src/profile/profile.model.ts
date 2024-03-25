import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Profile {
  @Field(() => ID)
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  bio?: string;

  @Field(() => [Profile], { nullable: 'itemsAndList' }) // This allows both the list and its items to be null
  friends?: Profile[];
}
