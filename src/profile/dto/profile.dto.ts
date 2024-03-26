import { Field, InputType } from '@nestjs/graphql';

export class CreateProfileDto {
  firstName: string;
  lastName: string;
  bio?: string;
}

export class UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  bio?: string;
}

@InputType()
export class UpdateProfileInput {
  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => String, { nullable: true })
  bio?: string;
}
