import { Injectable } from '@nestjs/common';
import { Profile } from './profile.model';
import { Neo4jService } from 'nest-neo4j/dist';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';

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
    if (res.records.length === 0) return [];
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

  async remove(id: string): Promise<boolean> {
    const result = await this.neo4jService.write(
      `MATCH (p:Profile {id: $id}) DETACH DELETE p RETURN p`,
      { id },
    );

    if (result.records.length === 0) {
      throw new Error('Profile deletion failed');
    }

    return true;
  }

  async update(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const updates = Object.entries(updateProfileDto)
      .filter(([, value]) => value !== undefined)
      .map(([key]) => `p.${key} = $${key}`)
      .join(', ');

    if (!updates) {
      throw new Error('No updates provided');
    }
    const query = `
    MATCH (p:Profile {id: $id})
    SET ${updates}
    RETURN p
  `;

    const parameters = { id, ...updateProfileDto };

    const result = await this.neo4jService.write(query, parameters);

    if (result.records.length === 0) {
      throw new Error('Profile update failed');
    }

    return result.records[0].get('p').properties as Profile;
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

  async getShortestRelationshipDistance(
    profileId: string,
    targetProfileId: string,
  ): Promise<number> {
    const result = await this.neo4jService.read(
      `
      MATCH (start:Profile {id: $profileId}), (end:Profile {id: $targetProfileId}),
      path = shortestPath((start)-[:FRIEND*]-(end))
      RETURN length(path) as distance      
       `,
      { profileId, targetProfileId },
    );

    if (result.records.length === 0) {
      return -1;
    }

    return result.records[0].get('distance').toNumber();
  }
}
