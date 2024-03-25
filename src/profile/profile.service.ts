import { Injectable } from '@nestjs/common';
import { Profile } from './profile.model';
import { Neo4jService } from 'nest-neo4j/dist';
import { CreateProfileDto } from './dto/profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async findFriendsById(profileId: string): Promise<Profile[]> {
    const result = await this.neo4jService.read(
      `MATCH (p:Profile {id: $profileId})-[:FRIEND]->(f:Profile) RETURN f`,
      { profileId },
    );

    return result.records.map(
      (record) => record.get('f').properties as Profile,
    );
  }

  async findAll(): Promise<Profile[]> {
    const res = await this.neo4jService.read('MATCH (n:Profile) RETURN n');
    return res.records.map((record) => record.get('n').properties);
  }

  async findOne(id: string): Promise<Profile | undefined> {
    const result = await this.neo4jService.read(
      `MATCH (p:Profile {id: $id}) RETURN p`,
      { id },
    );

    if (result.records.length === 0) {
      return undefined;
    }

    const record = result.records[0];
    const profile = record.get('p').properties as Profile;
    return profile;
  }

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    const { firstName, lastName, bio } = createProfileDto;
    const result = await this.neo4jService.write(
      `
      CREATE (p:Profile {id: apoc.create.uuid(), firstName: $firstName, lastName: $lastName, bio: $bio})
      RETURN p
      `,
      { firstName, lastName, bio: bio || '' },
    );

    if (result.records.length === 0) {
      throw new Error('Profile creation failed');
    }

    const newProfile = result.records[0].get('p').properties as Profile;
    return newProfile;
  }

  async addFriend(profileId: string, friendId: string): Promise<Profile> {
    const result = await this.neo4jService.write(
      `MATCH (p:Profile {id: $profileId})
       MATCH (f:Profile {id: $friendId})
       MERGE (p)-[r:FRIEND]->(f)
       RETURN p, r, f
       `,
      { profileId, friendId },
    );

    if (result.records.length === 0) {
      throw new Error('Friend addition failed');
    }

    const profile = result.records[0].get('p').properties as Profile;

    return profile;
  }

  async removeFriend(profileId: string, friendId: string): Promise<Profile> {
    const result = await this.neo4jService.write(
      `MATCH (p:Profile {id: $profileId})-[r:FRIEND]->(f:Profile {id: $friendId})
       DELETE r
       RETURN p
       `,
      { profileId, friendId },
    );

    if (result.records.length === 0) {
      throw new Error('Friend removal failed');
    }

    const profile = result.records[0].get('p').properties as Profile;

    return profile;
  }
}
